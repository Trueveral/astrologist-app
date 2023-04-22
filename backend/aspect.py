from typing import Literal, Optional, Dict, Any
from entity import Point
from flatlib import angle, const
from typedef import AspCandidate, AspObjectProps, AspProps
# Orb for minor and exact aspects
MAX_MINOR_ASP_ORB = 3
MAX_EXACT_ORB = 0.3


def _filter_asp(
        ab1: Point,
        ab2: Point,
        aspList,
        aspconfig: Optional[Dict[str, Any]] = None) -> AspCandidate | None:

    def asp_candicates() -> list[AspCandidate]:
        sep: float = angle.closestdistance(ab1.lon, ab2.lon)
        absSep: float = abs(sep)
        return [{
            'type': asp,
            'error': abs(absSep - asp),
            'separation': sep,
            'orb': aspconfig[str(asp)] if aspconfig else 0
        } for asp in aspList]

    # Ignore aspects from same and Syzygy
    if ab1.id == ab2.id or ab1.id == const.SYZYGY:
        return None

    candidates: list[AspCandidate] = asp_candicates()
    for aspc in candidates:
        t: int = aspc['type']
        e: float = aspc['error']
        orbtotal: Any | float | int = ab1.orb() + ab2.orb() + aspconfig[str(t)][
            "orb"] if aspconfig else ab1.orb() + ab2.orb()  # type: ignore

        if e <= orbtotal:
            return aspc

    return None


def _asp_props(ab1: Point, ab2: Point, aspc: AspCandidate) -> AspProps:
    e, t, o, sep = aspc['error'], aspc['type'], aspc['orb'], aspc['separation']

    # Properties
    prop1: AspObjectProps = {
        'id': ab1.id,
        'inOrb': ab1.orb() >= e,
        'movement': const.NO_MOVEMENT
    }
    prop2: AspObjectProps = {
        'id': ab2.id,
        'inOrb': ab2.orb() >= e,
        'movement': const.NO_MOVEMENT
    }
    prop: AspProps = {
        'type': t,
        'orb': o,
        'error': e,
        'direction': "Dexter",
        'condition': "Associate",
        'active': prop1,
        'passive': prop2
    }

    if t == const.NO_ASPECT:
        return prop

    # Direction
    prop['direction'] = const.DEXTER if sep <= 0 else const.SINISTER

    # Sign conditions
    # Note: if obj1 is before obj2, orbDir will be less than zero
    orbDir: float = sep - t if sep >= 0 else sep + t
    offset: float = ab1.signlon + orbDir
    prop['condition'] = const.ASSOCIATE if offset <= 30 else const.DISSOCIATE

    # Movement of the individual objects
    if abs(orbDir) < MAX_EXACT_ORB:
        prop1['movement'] = prop2['movement'] = const.EXACT
    else:
        prop1['movement'] = const.SEPARATIVE
        if (orbDir > 0 and ab1.isDirect()) or \
                (orbDir < 0 and ab1.isRetrograde()):
            prop1['movement'] = const.APPLICATIVE
        elif ab1.isStationary():
            prop1['movement'] = const.STATIONARY

        prop2['movement'] = const.NO_MOVEMENT
        obj2speed: float = ab2.lonspeed
        sameDir: bool = ab1.lonspeed * obj2speed >= 0
        if not sameDir:
            prop2['movement'] = prop1['movement']

    return prop


def _get_ap(ab1: Point, ab2: Point) -> dict[str, Point]:
    """ Returns which is the active and the passive objects. """
    speed1: float = abs(ab1.lonspeed)
    speed2: float = abs(ab2.lonspeed)
    if speed1 > speed2:
        return {'active': ab1, 'passive': ab2}
    else:
        return {'active': ab2, 'passive': ab1}


# === Public functions === #


def aspectType(ab1: Point, ab2: Point, aspList) -> int:
    """ Returns the aspect type between objects considering
    a list of possible aspect types.
    
    """
    ap: dict[str, Point] = _get_ap(ab1, ab2)
    aspc: AspCandidate | None = _filter_asp(ap['active'], ap['passive'],
                                            aspList)
    return aspc['type'] if aspc else const.NO_ASPECT


def hasAspect(ab1: Point, ab2: Point, aspList) -> bool:
    """ Returns if there is an aspect between objects 
    considering a list of possible aspect types.
    
    """
    t = aspectType(ab1, ab2, aspList)
    return t != const.NO_ASPECT


def isAspecting(ab1: Point, ab2: Point, aspList):
    """ Returns if obj1 aspects obj2 within its orb,
    considering a list of possible aspect types. 
    
    """
    aspc: AspCandidate | None = _filter_asp(ab1, ab2, aspList)
    if aspc:
        return aspc['error'] < ab1.orb()
    return False


def getAspect(ab1: Point,
              ab2: Point,
              aspList,
              aspconfig: Optional[Dict[str, Any]] = None):
    """ Returns an Aspect object for the aspect between two
    objects considering a list of possible aspect types.
    """
    ap: dict[str, Point] = _get_ap(ab1, ab2)
    aspc: AspCandidate | None = _filter_asp(ap['active'], ap['passive'],
                                            aspList, aspconfig)
    if not aspc:
        aspc = {
            'type': const.NO_ASPECT,
            'error': 0,
            'orb': 0,
            'separation': 0,
        }
    prop: AspProps = _asp_props(ap['active'], ap['passive'], aspc)
    return Aspect(prop)


class AspectObject:

    def __init__(self, props: AspObjectProps) -> None:
        self.id: str = props['id']
        self.inOrb: bool = props['inOrb']
        self.movement: Literal['Applicative', 'Separative', 'Exact',
                               'Stationary', 'None'] = props['movement']


class Aspect:

    def __init__(self, props: AspProps) -> None:
        self.type: int = props['type']
        self.error: float = props['error']
        self.orb: float = props['orb']
        self.direction: Literal['Dexter', 'Sinister'] = props['direction']
        self.condition: Literal['Associate', 'Dissociate'] = props['condition']
        self.active: AspectObject = AspectObject(props["active"])
        self.passive: AspectObject = AspectObject(props["passive"])

    def exists(self) -> bool:
        """ Returns if this aspect is valid. """
        return self.type != const.NO_ASPECT

    def movement(
        self
    ) -> Literal['Exact', 'Applicative', 'Separative', 'Stationary', 'None']:
        mov: Literal['Applicative', 'Separative', 'Exact', 'Stationary',
                     'None'] = self.active.movement
        if self.error < 1 and mov == const.SEPARATIVE:
            mov = const.EXACT
        return mov

    def mutualAspect(self) -> bool:
        return self.active.inOrb == self.passive.inOrb == True

    def mutualMovement(self) -> bool:
        return self.active.movement == self.passive.movement

    def getRole(self, ID):
        if self.active.id == ID:
            return {
                'role': 'active',
                'inOrb': self.active.inOrb,
                'movement': self.active.movement
            }
        elif self.passive.id == ID:
            return {
                'role': 'passive',
                'inOrb': self.passive.inOrb,
                'movement': self.passive.movement
            }
        return None

    def inOrb(self, ID):
        role = self.getRole(ID)
        return role['inOrb'] if role else None

    def __str__(self):
        return '<%s %s %s %s %s>' % (self.active.id, self.passive.id,
                                     self.type, self.active.movement,
                                     angle.toString(self.error))