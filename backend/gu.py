from __future__ import annotations
from typing import Optional, Dict, Any, Literal, TYPE_CHECKING, List
from flatlib.protocols import almutem
from entity import AstrologicalBody, Point, Planet
from aspect import Aspect, getAspect
from typedef import DateTime
if TYPE_CHECKING:
    from graph import Graph
from flatlib.dignities import essential
from flatlib.ephem import swe
from flatlib.datetime import Datetime
from flatlib import angle, const, props, utils


def is_house_1_asc(graph: Graph) -> bool:
    return angle.closestdistance(graph.houses["House1"].lon,
                                 graph.points[const.ASC].lon) < 0.0003


def is_house_10_mc(graph: Graph) -> bool:
    return angle.closestdistance(graph.houses["House10"].lon,
                                 graph.points[const.MC].lon) < 0.0003


def is_diurnal(graph: Graph) -> bool:
    """Returns true if this chart is diurnal."""
    sun: Planet = graph.planets[const.SUN]
    mc: Point = graph.points[const.MC]

    lat: float = graph.pos.lat
    sunRA, sunDecl = utils.eqCoords(sun.lon, sun.lat)
    mcRA, mcDecl = utils.eqCoords(mc.lon, 0)
    return utils.isAboveHorizon(sunRA, sunDecl, mcRA, lat)


def get_moon_phase(
    graph: Graph,
) -> Literal['First Quarter', 'Second Quarter', 'Third Quarter',
             'Last Quarter']:
    """Returns the phase of the moon."""
    sun: Planet = graph.planets[const.SUN]
    moon: Planet = graph.planets[const.MOON]
    dist: float = angle.distance(sun.lon, moon.lon)
    if dist < 90:
        return const.MOON_FIRST_QUARTER
    elif dist < 180:
        return const.MOON_SECOND_QUARTER
    elif dist < 270:
        return const.MOON_THIRD_QUARTER
    else:
        return const.MOON_LAST_QUARTER


def compute_aspect(
        ab1: Point,
        ab2: Point,
        asplist=const.MAJOR_ASPECTS,
        aspconfig: Optional[Dict[str,
                                 Any]] = None) -> Optional[Dict[str, Any]]:
    if ab1.type == const.OBJ_GENERIC and ab2.type == const.OBJ_GENERIC:
        return None
    aspect: Aspect = getAspect(ab1, ab2, aspList=asplist, aspconfig=aspconfig)
    if aspect.type != const.NO_ASPECT:
        return {
            "type": aspect.type,
            "name": props.aspect.name[aspect.type],
            "orb": aspect.orb,
            "error": aspect.error,
            "active": aspect.active.id,
            "passive": aspect.passive.id,
            "isMutualAspect": aspect.mutualAspect(),
            "isMutualMovement": aspect.mutualMovement(),
        }
    return None


def compute_k_aspect(ab_lists: List[List[Point]]) -> Dict[str, Any]:
    joint_aspects = {}
    for i, ab_list1 in enumerate(ab_lists):
        for j, ab_list2 in enumerate(ab_lists[i + 1:], start=i + 1):
            aspect_dic = {}
            for ab1 in ab_list1:
                for ab2 in ab_list2:
                    aspect: Dict[str, Any] | None = compute_aspect(ab1, ab2)
                    if aspect:
                        aspect_dic[ab1.id + ab2.id] = aspect
            joint_aspects[str(i + 1) + str(j + 1)] = aspect_dic

    return joint_aspects


def compute_dignity(
        planet: AstrologicalBody,
        dignity_list: list[str] = almutem.DIGNITY_LIST) -> Dict[str, Any]:
    row = almutem.newRow()
    dig_info = essential.getInfo(planet.sign, planet.signlon)  # type: ignore
    for dignity in dignity_list:
        obj_ID = dig_info[dignity]  # type: ignore
        if obj_ID:  # type: ignore
            score = essential.SCORES[dignity]  # type: ignore
            row[obj_ID]["string"] += "%s" % score
            row[obj_ID]["score"] += score
    return row


def pr_xrange(graph: Graph, maxerr: float, planet: str, start_jd: float,
              end_jd: float, lon: float) -> list[DateTime]:
    planet_return_dates: list[DateTime] = []
    planet_position: float = swe.sweObjectLon(planet, start_jd)

    while start_jd < end_jd:
        dist: float = angle.distance(planet_position, lon)

        while abs(dist) > maxerr:
            start_jd = start_jd + dist / props.object.meanMotion[planet]
            planet_position = swe.sweObjectLon(planet, start_jd)
            dist = angle.closestdistance(planet_position, lon)

        dt = Datetime.fromJD(start_jd, graph.date.utcoffset)
        planet_return_dates.append({
            "date": dt.date.toString(),
            "time": dt.time.toString(),
            "utcoffset": dt.utcoffset.toString(),
        })

        # 更新 jd 以进行下一次循环
        start_jd = start_jd + 360 / props.object.meanMotion[planet]

    return planet_return_dates


def pr_onetake(graph: Graph,
               maxerr: float,
               planet: str,
               start_jd: float,
               lon: float,
               forward: bool = True) -> DateTime:
    planet_position: float = swe.sweObjectLon(planet, start_jd)
    dist: float = angle.distance(planet_position, lon)
    jd: float = start_jd

    while abs(dist) > maxerr:
        if forward:
            jd += dist / props.object.meanMotion[planet]
        else:
            jd -= dist / props.object.meanMotion[planet]
        planet_position = swe.sweObjectLon(planet, jd)
        dist = angle.closestdistance(planet_position, lon)

    dt = Datetime.fromJD(jd, graph.date.utcoffset)
    return {
        "date": dt.date.toString(),
        "time": dt.time.toString(),
        "utcoffset": dt.utcoffset.toString(),
    }


def k_graph_snapshot(*args: Graph) -> Dict[str, Any]:
    snapshots, ab_lists = {}, []
    for i, _graph in enumerate(args):
        ab_lists.append(_graph.get_astrological_bodies())
        snapshots[str(i + 1)] = _graph.describe()
    snapshots["joint_aspects"] = compute_k_aspect(ab_lists)
    return snapshots
