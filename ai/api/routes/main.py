from fastapi import APIRouter
from .generation import main as generation
from .device import main as device
from .training import main as training

api_router = APIRouter(
    prefix="/api"
)

api_router.include_router(generation.router)
api_router.include_router(training.router)
api_router.include_router(device.router)
