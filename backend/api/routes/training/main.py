from fastapi import APIRouter

from api.routes.training import dreambooth

router = APIRouter(
    prefix="/training",
    tags=["training"]
)

router.include_router(dreambooth.router)
