from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import requests
from core.config import settings
from dependencies import get_current_user
from models import Member

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

@router.get("/{model_name}/download")
async def model_download(model_name: str, current_user: Member = Depends(get_current_user)):
    member_id = current_user.member_id
    try:
        ai_server_url = f"{settings.AI_SERVER_URL}/model/{model_name}/download?member_id={member_id}"
        response = requests.get(ai_server_url)

        if response.status_code == 200:
            return {"task_id": response.json().get("task_id")}

        elif response.status_code == 404:
            raise HTTPException(status_code=404, detail="해당 모델을 찾을 수 없습니다.")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"응답 중 오류 발생 : {response.text}")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"통신 중 에러 발생: {str(e)}")
