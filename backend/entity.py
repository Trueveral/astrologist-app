from __future__ import annotations
from typing import Literal, List, Any, Optional, Self, TYPE_CHECKING
from flatlib.dignities.accidental import (
    sunRelation,
    light,
    orientality,
    haiz,
)
from flatlib import angle, utils, const, props
if TYPE_CHECKING:
    from graph import Graph
from copy import deepcopy


class AstrologicalBody:

    def __init__(self, id: str, type: str, lon: float, lat: float) -> None:
        self.id: str = id
        self.type: str = type
        self.lon: float = lon
        self.lat: float = lat
        self.sign: str = "sign"
        self.signlon: float = 0.0
        self.relocate(self.lon)

    def copy(self) -> Self:
        return deepcopy(self)

    def __str__(self) -> str:
        return "<%s %s %s>" % (self.id, self.sign, angle.toString(
            self.signlon))

    def isPlanet(self) -> bool:
        """Returns if this object is a planet."""
        return self.type == const.OBJ_PLANET

    def eqCoords(self, zerolat=False) -> tuple[float, float]:
        """Returns the Equatorial Coordinates of this object.
        Receives a boolean parameter to consider a zero latitude.

        """
        lat = 0.0 if zerolat else self.lat
        return utils.eqCoords(self.lon, lat)

    # === Functions === #

    def relocate(self, lon):
        """Relocates this object to a new longitude."""
        self.lon = angle.norm(lon)
        self.signlon = self.lon % 30
        self.sign = const.LIST_SIGNS[int(self.lon / 30.0)]

    def antiscia(self):
        """Returns antiscia object."""
        obj = self.copy()
        obj.type = const.OBJ_GENERIC
        obj.relocate(360 - obj.lon + 180)
        return obj

    def cantiscia(self) -> Self:
        """Returns contra-antiscia object."""
        obj = self.copy()
        obj.type = const.OBJ_GENERIC
        obj.relocate(360 - obj.lon)
        return obj

    def is_seven_planet(self) -> bool:
        return self.id in const.LIST_SEVEN_PLANETS  # type: ignore

    def describe(self, graph: Optional[Graph] = None) -> dict[str, Any]:
        return self.__dict__


class Point(AstrologicalBody):

    def __init__(self,
                 id: str,
                 type: str,
                 lon: float,
                 lat: float = 0,
                 lonspeed: float = 0,
                 latspeed: float = 0,
                 orb_data: float = 0,
                 mean_motion: float = 0) -> None:
        super().__init__(id, type, lon, lat)
        self.lonspeed: float = lonspeed
        self.latspeed: float = latspeed
        self.orb_data: float = orb_data
        self.mean_motion: float = mean_motion

    def movement(self) -> Literal['Stationary', 'Direct', 'Retrograde']:
        """Returns if this object is direct, retrograde
        or stationary.

        """
        if abs(self.lonspeed) < 0.0003:
            return const.STATIONARY
        elif self.lonspeed > 0:
            return const.DIRECT
        else:
            return const.RETROGRADE

    def orb(self) -> float | int:
        """Returns the orb of this object."""
        return (self.orb_data
                if "orb_data" in self.__dict__ else props.object.orb[self.id])

    def meanMotion(self):
        return (self.mean_motion if "mean_motion" in self.__dict__ else
                props.object.meanMotion[self.id])

    def isDirect(self) -> bool:
        """Returns if this object is in direct motion."""
        return self.movement() == const.DIRECT

    def isRetrograde(self) -> bool:
        """Returns if this object is in retrograde motion."""
        return self.movement() == const.RETROGRADE

    def isStationary(self) -> bool:
        """Returns if this object is stationary."""
        return self.movement() == const.STATIONARY

    def isFast(self):
        """Returns if this object is in fast motion."""
        return abs(self.lonspeed) >= self.meanMotion()

    def describe(self, graph: Optional[Graph] = None) -> dict[str, Any]:
        result: dict[str, Any] = self.__dict__
        sun: Any | None = graph.planets[const.SUN] if graph else None

        result.update({
            "movement": self.movement(),
            "sunbeams": sunRelation(self, sun) if sun else None,
            "light": light(self, sun) if sun else None,
            "orientality": orientality(self, sun) if sun else None,
            "isFast": self.isFast(),
        })

        return result


class Asteroid(Point):

    def __init__(self, id: str, type: str, lon: float, lat: float,
                 lonspeed: float, latspeed: float, orb_data: float,
                 mean_motion: float) -> None:
        super().__init__(id, type, lon, lat, lonspeed, latspeed, orb_data,
                         mean_motion)


class Planet(Asteroid):

    def __init__(self, id: str, type: str, lon: float, lat: float,
                 lonspeed: float, latspeed: float, orb_data: float,
                 mean_motion: float, gender_data: str, faction_data: str,
                 temperament_data: str, signjoy_data: str, housejoy_data: str,
                 element_data: str) -> None:
        super().__init__(id, type, lon, lat, lonspeed, latspeed, orb_data,
                         mean_motion)
        self.gender_data: str = gender_data
        self.faction_data: str = faction_data
        self.element_data: str = element_data
        self.temperament_data: str = temperament_data
        self.signjoy_data: str = signjoy_data
        self.housejoy_data: str = housejoy_data

    def gender(self) -> str:
        """Returns the gender of this object."""
        return (self.gender_data if self.gender_data != const.NONE else
                props.object.gender[self.id])

    def faction(self) -> str:
        """Returns the faction of this object."""
        return (self.faction_data if self.faction_data != const.NONE else
                props.object.faction[self.id])

    def element(self) -> str:
        """Returns the element of this object."""
        return (self.element_data if self.element_data != const.NONE else
                props.object.element[self.id])

    def describe(self, graph: Optional[Graph] = None) -> dict[str, Any]:
        result: dict[str, Any] = self.__dict__
        sun: Any | None = graph.planets[const.SUN] if graph else None
        if self.is_seven_planet():
            result.update({
                # "haiz": haiz(self, graph),
            })

        result.update({
            "sunbeams": sunRelation(self, sun) if sun else None,
            "light": light(self, sun) if sun else None,
            "orientality": orientality(self, sun) if sun else None,
            "isFast": self.isFast(),
        })

        return result


class House(AstrologicalBody):
    """This class represents a generic house cusp."""

    # The traditional house offset
    _OFFSET: float = -5.0

    def __init__(self,
                 id: str,
                 type: str,
                 lon: float,
                 lat: float = 0,
                 size: float = 30.0) -> None:
        super().__init__(id, type, lon, lat)
        self.size: float = size

    def __str__(self) -> str:
        string: str = super().__str__()[:-1]
        return "%s %s>" % (string, self.size)

    # === Properties === #

    def num(self) -> int:
        """Returns the number of this house [1..12]."""
        return int(self.id[5:])  # type: ignore

    def condition(self):
        """Returns the condition of this house.
        The house can be angular, succedent or cadent.

        """
        return props.house.condition[self.id]  # type: ignore

    def gender(self):
        """Returns the gender of this house."""
        return props.house.gender[self.id]  # type: ignore

    # === Functions === #

    def isAboveHorizon(self) -> bool:
        """Returns true if this house is above horizon."""
        return self.id in props.house.aboveHorizon  # type: ignore

    def inHouse(self, lon):
        """Returns if a longitude belongs to this house."""
        dist = angle.distance(self.lon + House._OFFSET, lon)  # type: ignore
        return dist < self.size

    def hasObject(self, obj):
        """Returns true if an object is in this house."""
        return self.inHouse(obj.lon)

    def describe(self, graph: Optional[Graph] = None) -> dict[str, Any]:
        result: dict[str, Any] = self.__dict__
        ab_list: List[AstrologicalBody] = graph.get_astrological_bodies(
        ) if graph else []
        inhouse_bodies: List[str] = []
        for ab in ab_list:
            if self.hasObject(ab):
                inhouse_bodies.append(ab.id)  # type: ignore

        result.update({
            "condition": self.condition(),
            "aboveHorizon": self.isAboveHorizon(),
            "objects": inhouse_bodies,
        })
        return result


class FixedStar(AstrologicalBody):
    """This class represents a generic fixed star."""

    def __init__(self, id: str, type: str, lon: float, lat: float):
        super().__init__(id, type, lon, lat)
        self.type = const.OBJ_FIXED_STAR
        self.mag = 0.0

    def __str__(self) -> str:
        string: str = super().__str__()[:-1]
        return "%s %s>" % (string, self.mag)

    # === Properties === #

    # === Functions === #

    # def aspects(self, obj):
    #     """Returns true if this star aspects another object.
    #     Fixed stars only aspect by conjunctions.
    #     """
    #     dist = angle.closestdistance(self.lon, obj.lon)  # type: ignore
    #     return abs(dist) < self.orb()
