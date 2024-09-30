from fastapi import APIRouter

from api.routes.model import model

router = APIRouter(
    prefix="/model",
    tags=["GPU Server Model Related API"]
)

router.include_router(model.router)
