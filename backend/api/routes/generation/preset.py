from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from starlette.responses import JSONResponse, Response

from dependencies import get_current_user
from models import Member
from schema.presets import *

router = APIRouter(
    prefix="/presets",
)


@router.get("")
async def get_preset_list(
        member: Member = Depends(get_current_user)
):
    presets = await GenerationPreset.find(GenerationPreset.member_id == member.member_id).to_list()
    data = {
        "count": len(presets),
        "presets": presets
    }
    return data


@router.post("")
async def create_preset(
        request: GenerationPreset,
        member: Member = Depends(get_current_user)
):
    all_none = all(
        getattr(request, field) is None
        for field in request.model_dump(exclude={"preset_title", "generation_type", "date"})
    )

    if all_none:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최소 하나의 파라미터를 입력해야 합니다."
        )

    request.member_id = member.member_id

    data = await request.insert()

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=data.json())


@router.get("/{preset_id}")
async def get_preset_by_id(
        preset_id: PydanticObjectId,
        member: Member = Depends(get_current_user)
):
    preset = await GenerationPreset.get(preset_id)

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 ID의 Preset을 찾을 수 없습니다."
        )

    if preset.member_id != member.member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="자기 자신의 Preset만 조회할 수 있습니다."
        )

    return preset


@router.patch("/{preset_id}")
async def update_preset(
        preset_id: PydanticObjectId,
        request: GenerationPresetUpdate,
        member: Member = Depends(get_current_user)
):
    preset = await GenerationPreset.get(preset_id)

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 ID의 Preset을 찾을 수 없습니다."
        )

    if preset.member_id != member.member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="자기 자신의 Preset만 수정할 수 있습니다."
        )

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(preset, key, value)

    await preset.save()

    return preset


@router.delete("/{preset_id}")
async def delete_preset(
        preset_id: PydanticObjectId,
        member: Member = Depends(get_current_user)
):
    preset = await GenerationPreset.get(preset_id)

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 ID의 Preset을 찾을 수 없습니다."
        )

    if preset.member_id != member.member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="자기 자신의 Preset만 삭제할 수 있습니다."
        )

    await preset.delete()

    return Response(status_code=status.HTTP_204_NO_CONTENT)