from fastapi import APIRouter

from api.routes.model import model

router = APIRouter(
    prefix="/model",
    tags=["model"],

)

router.include_router(model.router)
