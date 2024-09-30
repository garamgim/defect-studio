from fastapi import APIRouter, HTTPException
import requests
from core.config import settings

router = APIRouter(
    prefix="",
)



@router.get("/{member_id}")
async def get_model_names_from_ai(member_id: str):
    try:
        # AI 서버에 요청 보내기
        response = requests.get(f"{settings.AI_SERVER_URL}/model/{member_id}")

        # 요청 성공 시
        if response.status_code == 200:
            model_names = response.json()
            print(model_names)
            return model_names
        elif response.status_code == 404:
            raise HTTPException(status_code=404, detail="AI 서버에 해당 member_id에 대한 모델이 없습니다.")
        else:
            raise HTTPException(status_code=response.status_code, detail="AI 서버 요청 중 에러 발생.")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"AI 서버와의 통신 중 에러 발생: {str(e)}")


