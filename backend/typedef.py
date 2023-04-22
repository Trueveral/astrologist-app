from __future__ import annotations
from flatlib import const
from typing import TypedDict, Literal, Optional, Dict, Any, Union, List


class AspCandidate(TypedDict):
    type: int
    error: float
    separation: float
    orb: float


class AspObjectProps(TypedDict):
    id: str
    inOrb: bool
    movement: Literal[const.APPLICATIVE, const.SEPARATIVE, const.EXACT,
                      const.STATIONARY, const.NONE]


class AspProps(TypedDict):
    type: int
    error: float
    orb: float
    direction: Literal[const.DEXTER, const.SINISTER]
    condition: Literal[const.ASSOCIATE, const.DISSOCIATE]
    active: AspObjectProps
    passive: AspObjectProps


class DateTime(TypedDict):
    date: str
    time: str
    utcoffset: str


class Position(TypedDict):
    lon: str
    lat: str


class GraphConfig(TypedDict):
    hsys: str
    IDs: List[str]
    date: DateTime
    pos: Position
    planets: Optional[Dict[str, Any]]
    points: Optional[Dict[str, Any]]
    asteroids: Optional[Dict[str, Any]]
    houses: Optional[Dict[str, Any]]
    aspects: Optional[Dict[str, Any]]


class DescribeConfig(TypedDict):
    planets: Optional[bool]
    points: Optional[bool]
    houses: Optional[bool]
    aspects: Optional[bool]
    dignities: Optional[bool]


class Config(TypedDict):
    graph: GraphConfig
    describe: DescribeConfig