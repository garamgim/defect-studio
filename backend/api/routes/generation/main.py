from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from api.routes.generation import tti, iti, inpainting, rembg, cleanup, clip
from enums import SchedulerType, GenerationType
from models import GenerationPreset

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


@router.get("/schedulers")
def get_scheduler_list():
    return [scheduler.value for scheduler in SchedulerType]


@router.post("/presets/{generation_type}")
async def save_presets(
        generation_type: GenerationType,
        request: GenerationPreset
):
    all_none = all(
        getattr(request, field) is None
        for field in request.model_dump(exclude={"member_id", "date"})
    )

    if all_none:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최소 하나의 파라미터를 입력해야 합니다."
        )

    request.generation_type = generation_type.value

    data = await request.insert()

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=data.json())
