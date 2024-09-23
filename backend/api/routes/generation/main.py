from fastapi import APIRouter

from api.routes.generation import tti, iti, inpainting, rembg, cleanup, clip, preset
from enums import SchedulerType

router = APIRouter(
    prefix="/generation",
    tags=["generation"]
)

router.include_router(tti.router)
router.include_router(iti.router)
router.include_router(inpainting.router)
router.include_router(rembg.router)
router.include_router(cleanup.router)
router.include_router(clip.router)
router.include_router(preset.router)


@router.get("/schedulers")
def get_scheduler_list():
    return [scheduler.value for scheduler in SchedulerType]



