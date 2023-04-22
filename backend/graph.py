from __future__ import annotations
from typing import Callable, List, Literal, Optional, Dict, Any, Self, Type, Union, cast
from typedef import DateTime
from entity import AstrologicalBody, Planet, House, Point, Asteroid, FixedStar
from typedef import GraphConfig, DescribeConfig, Config
from flatlib.ephem import eph
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib import const, props
from copy import deepcopy
import gu


class Graph:

    def __init__(self, config: Config) -> None:
        self.config: GraphConfig = config["graph"]
        self.oriconfig: GraphConfig = self.config
        self.describeconfig: DescribeConfig = config["describe"]
        self.hsys: str = self.config["hsys"]
        self.IDs: List[str] = self.config["IDs"]
        self.date: Datetime = Datetime(self.config["date"]["date"],
                                       self.config["date"]["time"],
                                       self.config["date"]["utcoffset"])
        self.pos: GeoPos = GeoPos(self.config["pos"]["lat"],
                                  self.config["pos"]["lon"])
        self.planets: Dict[str, Planet] = {}
        self.asteroids: Dict[str, Asteroid] = {}
        self.fixedstars: Dict[str, FixedStar] = {}
        self.points: Dict[str, Point] = {}
        self.houses: Dict[str, House] = {}
        self.is_diurnal: bool = True
        self.moon_phase: Literal['First Quarter', 'Second Quarter',
                                 'Third Quarter',
                                 'Last Quarter'] = 'First Quarter'
        self.is_asc_1: bool = True
        self.is_mc_10: bool = True
        self.refresh()

    def refresh(self, config: Optional[Config] = None) -> None:
        if config:
            self.config = config["graph"]
            self.describeconfig = config["describe"]

        self.hsys = self.config["hsys"]
        self.IDs = self.config["IDs"]
        self.date = Datetime(self.config["date"]["date"],
                             self.config["date"]["time"],
                             self.config["date"]["utcoffset"])
        self.pos = GeoPos(self.config["pos"]["lat"], self.config["pos"]["lon"])
        plconf, hconf, ptconf, aoiconf = (
            self.config["planets"],
            self.config["houses"],
            self.config["points"],
            self.config["asteroids"],
        )

        def create_object(
            obj_class: Type[Union[Planet, House, Point, Asteroid, FixedStar]],
            type: str,
            ephobj: Dict[str, Any],
            id: str,
            config: Dict[str, Any],
            default_config: Any,
            extra_attr: Optional[Dict[str, str]] = None
        ) -> Union[Planet, House, Point, Asteroid, FixedStar]:
            attr_dict: dict[str, str] = {'id': id, 'type': type}

            if extra_attr:
                for a, adef in extra_attr.items():
                    if a in ['lonspeed', 'latspeed']:
                        attr_dict[a] = ephobj.get(a, 0)
                        continue
                    attr_dict[a] = config[id].get(
                        adef,
                        getattr(default_config, adef)[id])

            return obj_class(**{**attr_dict, **ephobj})  # type: ignore

        def extra_attrs(mode) -> dict[str, str]:
            d: dict[str, str] = {
                "lonspeed": "lonspeed",
                "latspeed": "latspeed",
                "orb_data": "orb",
                "mean_motion": "meanMotion",
            }
            if mode == "planet":
                d.update({
                    'gender_data': 'gender',
                    'element_data': 'element',
                    'faction_data': 'faction',
                    'temperament_data': 'temperament',
                    'signjoy_data': 'signjoy',
                    'housejoy_data': 'housejoy',
                })
            elif mode == "house":
                return {"size": "size"}
            return d

        houses, angles = eph.getHouses(self.date.jd, self.pos.lat,
                                       self.pos.lon, self.hsys)

        def process_id(id_type: str) -> Callable:

            def wrapper(ID: str) -> None:
                e = next(
                    (x for x in (angles if ID in const.LIST_ANGLES else houses)
                     if x["id"] == ID)
                ) if ID in const.LIST_ANGLES + const.LIST_HOUSES else eph.getObject(
                    ID, self.date.jd, self.pos.lat, self.pos.lon)

                config = {
                    "planet": (Planet, const.OBJ_PLANET, plconf, self.planets,
                               extra_attrs("planet")),
                    "point": (Point, const.OBJ_GENERIC, ptconf, self.points,
                              extra_attrs("point")),
                    "asteroid": (Asteroid, const.OBJ_ASTEROID, aoiconf,
                                 self.asteroids, extra_attrs("asteroid")),
                    "fixedstar": (FixedStar, const.OBJ_ASTEROID, aoiconf,
                                  self.fixedstars, extra_attrs("fixedstar")),
                    "house":
                    (House, const.OBJ_HOUSE, hconf, self.houses, None),
                }

                obj_class, obj_type, obj_conf, obj_dict, extra_attr = config[
                    id_type]
                obj_dict[ID] = cast(  # type: ignore
                    obj_class,  # type: ignore
                    create_object(obj_class, obj_type, e, ID, obj_conf,
                                  props.object, extra_attr))

            return wrapper

        id_mapping = {
            **{ID: "planet"
               for ID in const.LIST_PLANETS},
            **{ID: "point"
               for ID in const.LIST_POINTS + const.LIST_POINTS_HB},
            **{ID: "asteroid"
               for ID in const.LIST_ASTEROIDS},
            **{ID: "fixedstar"
               for ID in const.LIST_FIXED_STARS},
            **{ID: "house"
               for ID in const.LIST_HOUSES},
        }

        for ID in self.IDs:
            if ID not in id_mapping:
                raise ValueError("Invalid ID")
            process_id(id_mapping[ID])(ID)

        self.is_diurnal = gu.is_diurnal(self)
        self.moon_phase = gu.get_moon_phase(self)
        self.is_asc_1 = gu.is_house_1_asc(self)
        self.is_mc_10 = gu.is_house_10_mc(self)

    def get_date(self) -> Dict[str, str]:
        return {
            "date": self.date.date.toString(),
            "time": self.date.time.toString(),
            "utcoffset": self.date.utcoffset.toString(),
        }

    def get_pos(self) -> str:
        return self.pos.strings()  # type: ignore

    def get_astrological_bodies(self,
                                fixedstar=False) -> List[AstrologicalBody]:
        if fixedstar:
            return [
                v for t in (self.planets.items(), self.asteroids.items(),
                            self.points.items(), self.fixedstars.items())
                for _, v in t
            ]
        else:
            return [
                v for t in (self.planets.items(), self.asteroids.items(),
                            self.points.items()) for _, v in t
            ]

    def restore(self) -> Self:
        self.config = self.oriconfig
        self.refresh()
        return self

    def rotate(self, target_time: Dict[str, str]) -> Self:
        natal_offset = self.date.utcoffset.toString()  # type: ignore
        self.config["date"] = {
            "date": target_time["date"],
            "time": target_time["time"],
            "utcoffset": natal_offset,
        }
        self.refresh()
        return self

    # TODO: Check the correctness of this function
    def planet_return_date(
        self,
        planet: str,
        maxerr: float = 0.0003,
        **kwargs,
    ) -> List[DateTime] | DateTime:
        # use planet as key to search for values in self.planets, self.asteroids, self.fixedstars
        if planet in self.planets:
            lon: float = self.planets[planet].lon
        elif planet in self.asteroids:
            lon = self.asteroids[planet].lon
        elif planet in self.fixedstars:
            lon = self.fixedstars[planet].lon
        else:
            raise ValueError("Invalid planet")

        if "start_date" in kwargs and "end_date" in kwargs:
            start_date = kwargs["start_date"]
            end_date = kwargs["end_date"]

            start_jd = Datetime(
                start_date,
                self.get_date()["time"],  # type: ignore
                self.get_date()["utcoffset"]).jd  # type: ignore
            end_jd = Datetime(
                end_date,
                self.get_date()["time"],  # type: ignore
                self.get_date()["utcoffset"]).jd  # type: ignore
            return gu.pr_xrange(self, maxerr, planet, start_jd, end_jd, lon)

        else:
            forward = True if "forward" not in kwargs else kwargs["forward"]
            start_jd = self.date.jd
            end_jd = start_jd + 1 if forward else start_jd - 1
            return gu.pr_onetake(self, maxerr, planet, start_jd, lon, forward)

    def describe(self) -> Dict[str, Any]:
        config: DescribeConfig = self.describeconfig
        result = {
            "hsys": self.hsys,  # type: ignore
            "datetime": self.get_date(),
            "geopos": self.get_pos(),
            # "alm_scores": almutem.compute(self)["Score"],
            "is_diurnal": self.is_diurnal,
            "moon_phase": self.moon_phase,
            "is_house_1_asc": self.is_asc_1,
            "is_house_10_mc": self.is_mc_10,
        }

        ab_list: List[Point] = cast(List[Point],
                                    self.get_astrological_bodies())

        if config["planets"]:
            result["planets"] = {
                k: v.describe(graph=self)
                for k, v in self.planets.items()
            }

        if config["points"]:
            result["points"] = {
                k: v.describe(graph=self)
                for k, v in self.points.items()
            }

        if config["houses"]:
            result["houses"] = {
                k: v.describe(graph=self)
                for k, v in self.houses.items()
            }

        if config["aspects"]:
            aspects_data = {}
            for i, ab1 in enumerate(ab_list):
                for ab2 in ab_list[i + 1:]:
                    aspect: Dict[str, Any] | None = gu.compute_aspect(
                        ab1, ab2, aspconfig=self.config["aspects"])
                    if aspect:
                        aspects_data[ab1.id + ab2.id] = aspect
            result["aspects"] = aspects_data

        if config["dignities"]:
            result["dignities"] = {
                ab.id: gu.compute_dignity(ab)
                for ab in ab_list if ab.is_seven_planet()
            }

        return result

    def copy(self) -> Self:
        return deepcopy(self)
