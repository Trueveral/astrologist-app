from typing import Dict, Any, List
from typedef import Config, DateTime
from graph import Graph
from gu import k_graph_snapshot


def get_graph(config: Config) -> Dict[str, Any]:
    return Graph(config).describe()


def proceed(g: Graph, target_time: Dict[str, str]) -> Dict[str, Any]:
    return g.rotate(target_time).describe()


def restore(g: Graph) -> Dict[str, Any]:
    return g.restore().describe()


def comparison(*args: Graph) -> Dict[str, Any]:
    return k_graph_snapshot(*args)


def pr_date(g: Graph, planet: str, maxerr: float = 0.0003, get_graph: bool = True, **kwargs):
    res: List[DateTime] | DateTime = g.planet_return_date(
        planet, maxerr, **kwargs)
    if isinstance(res, list):
        return res
    else:
        return {
            "date": res,
            "graph": get_graph and g.rotate({
                "date": res["date"],
                "time": res["time"],
            }).describe() or None
        }
