from typing import Dict, Any, TYPE_CHECKING
from fastapi import FastAPI
from typedef import Config
import service

app = FastAPI()


@app.post('/graph')
async def get_graph(config: Config) -> Dict[str, Any]:
    return service.get_graph(config)