from fastapi import APIRouter

from api.routes.device import util

router = APIRouter(
    prefix="/device",
    tags=["device"]
)

router.include_router(util.router)
