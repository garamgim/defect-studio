from typing import Optional, List

import requests
from fastapi import APIRouter, UploadFile, File, Form, status, HTTPException, Response, Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
import json

from api.routes.members import use_tokens
from core.config import settings
from dependencies import get_db, get_current_user
from enums import GPUEnvironment, UseType, Role
from models import Member
from schema.tokens import TokenUse

router = APIRouter(
    prefix="/dreambooth",
)


@router.post("/{gpu_env}")
async def dreambooth(
        gpu_env: Optional[GPUEnvironment] = GPUEnvironment.remote,
        gpu_device: int = Form(..., description="사용할 GPU의 장치 번호"),
        current_user: Member = Depends(get_current_user),
        is_inpaint: str = Form(None, description="inpainting 모델 학습 여부 (True, ' ')", examples=["True", ""]),
        find_hugging_face: str = Form(None, description="hugging face 모델 여부 (True, ' ')", examples=["", "True"]),
        pretrained_model_name_or_path: str = Form(..., description="초기 모델입니다.",
                                                  examples=["stable-diffusion-2-inpainting"]),
        train_model_name: str = Form(..., description="훈련된 모델의 이름을 지정합니다", examples=["custom_model"]),
        tokenizer_name: str = Form(None, description="사전 학습된 토크나이저 이름 또는 경로.", examples=[""]),
        revision: str = Form(None, description="모델의 리비전 (선택사항).", examples=[""]),

        concept_list: str = Form(..., description="instance, class 관련 정보", examples=[
            '''[
                {
                    "instance_prompt": "a photo of a sks cat",
                    "class_prompt": "a photo of a cat",
                    "instance_image_count": 2,
                    "class_image_count": 3
                },
                {
                    "instance_prompt": "a photo of a sks dog",
                    "class_prompt": "a photo of a dog",
                    "instance_image_count": 2,
                    "class_image_count": 3
                }
            ]'''
        ]),
        instance_image_list: List[UploadFile] = File(..., description="학습 이미지 파일"),
        class_image_list: List[UploadFile] = File(None, description="학습 범주 이미지 파일"),
        resolution: int = Form(..., description="학습 및 검증 이미지 해상도.", examples=[512]),
        prior_loss_weight: float = Form(None, ge=0.0, description="사전 보존 손실의 가중치.", examples=["", 1.0]),
        center_crop: str = Form(None, description="이미지를 중앙에서 자를지 여부. (True, ' ')", examples=["", "True"]),

        train_batch_size: int = Form(..., description="학습 데이터 로더의 배치 크기.", examples=[2]),
        num_train_epochs: int = Form(..., description="학습할 에폭 수.", examples=[50]),
        learning_rate: float = Form(..., description="초기 학습률.", examples=[5e-6]),
        max_train_steps: int = Form(None, description="학습할 최대 스텝 수.", examples=["", 100]),
        gradient_accumulation_steps: int = Form(None, description="그래디언트 누적 스텝 수.", examples=["", 1]),
        scale_lr: str = Form(None, description="GPU 수에 따라 학습률을 스케일링할지 여부. (True, ' ')", examples=["", "True"]),
        lr_scheduler: str = Form(None, description="학습률 스케줄러 유형.",
                                 examples=["", "constant", "linear", "cosine", "cosine_with_restarts", "polynomial",
                                           "constant_with_warmup"]),
        lr_warmup_steps: int = Form(None, description="학습률 워밍업 스텝 수.", examples=["", 500]),
        lr_num_cycles: int = Form(None, description="`cosine_with_restarts` 스케줄러의 사이클 수.", examples=["", 1]),
        lr_power: float = Form(None, description="다항 스케줄러에서의 파워 팩터.", examples=["", 1.0]),
        use_8bit_adam: str = Form(None, description="8비트 Adam 옵티마이저 사용 여부. (True, ' ')", examples=["", "True"]),
        gradient_checkpointing: str = Form(None, description="메모리 절약을 위한 그래디언트 체크포인팅. (True, ' ')",
                                           examples=["", "True"]),
        seed: int = Form(None, description="재현 가능한 학습을 위한 시드.", examples=[""]),
        train_text_encoder: str = Form(None, description="텍스트 인코더를 학습할지 여부. (True, ' ')", examples=["", "True"]),

        adam_beta1: float = Form(None, description="Adam 옵티마이저의 beta1 값.", examples=["", 0.9]),
        adam_beta2: float = Form(None, description="Adam 옵티마이저의 beta2 값.", examples=["", 0.999]),
        adam_weight_decay: float = Form(None, description="Adam 옵티마이저의 가중치 감쇠 값.", examples=["", 1e-2]),
        adam_epsilon: float = Form(None, description="Adam 옵티마이저의 epsilon 값.", examples=["", 1e-8]),
        max_grad_norm: float = Form(None, description="그래디언트 클리핑의 최대 노름.", examples=["", 1.0]),

        checkpointing_steps: int = Form(None, description="체크포인트를 저장할 스텝 수. Client 입장에서 필요할지 검토 필요",
                                        examples=["", 500]),
        checkpoints_total_limit: int = Form(None, description="저장할 체크포인트의 최대 개수.", examples=["", 3]),
        resume_from_checkpoint: str = Form(None, description="이전 체크포인트에서 학습을 재개할지 여부. (True, ' ')", examples=[""]),
):

    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

    cost = 1000 + (num_train_epochs * len(instance_image_list))

    if current_user.role != Role.super_admin and current_user.token_quantity < cost:
        raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

    member_id = current_user.member_id
    if find_hugging_face is not None and find_hugging_face != "":
        pretrained_model_name_or_path = f"hub/{pretrained_model_name_or_path}"

    form_data = {
        "gpu_device": gpu_device,
        "pretrained_model_name_or_path": pretrained_model_name_or_path,  # ai 서버에서 startsWith 확인
        "member_id": member_id,
        "train_model_name": train_model_name,
        "concept_list": concept_list,
        "resolution": resolution,
        "train_batch_size": train_batch_size,
        "num_train_epochs": num_train_epochs,
        "learning_rate": learning_rate,
        "cost": cost
    }
    if is_inpaint:
        form_data["is_inpaint"] = is_inpaint
    if revision:
        form_data["revision"] = revision
    if tokenizer_name:
        form_data["tokenizer_name"] = tokenizer_name
    if prior_loss_weight:
        form_data["prior_loss_weight"] = prior_loss_weight
    if seed:
        form_data["seed"] = seed
    if center_crop:
        form_data["center_crop"] = center_crop
    if train_text_encoder:
        form_data["train_text_encoder"] = train_text_encoder
    if max_train_steps:
        form_data["max_train_steps"] = max_train_steps
    if checkpointing_steps:
        form_data["checkpointing_steps"] = checkpointing_steps
    if checkpoints_total_limit:
        form_data["checkpoints_total_limit"] = checkpoints_total_limit
    if resume_from_checkpoint:
        form_data["resume_from_checkpoint"] = resume_from_checkpoint
    if gradient_accumulation_steps:
        form_data["gradient_accumulation_steps"] = gradient_accumulation_steps
    if gradient_checkpointing:
        form_data["gradient_checkpointing"] = gradient_checkpointing
    if scale_lr:
        form_data["scale_lr"] = scale_lr
    if lr_scheduler:
        form_data["lr_scheduler"] = lr_scheduler
    if lr_warmup_steps:
        form_data["lr_warmup_steps"] = lr_warmup_steps
    if lr_num_cycles:
        form_data["lr_num_cycles"] = lr_num_cycles
    if lr_power:
        form_data["lr_power"] = lr_power
    if use_8bit_adam:
        form_data["use_8bit_adam"] = use_8bit_adam
    if adam_beta1:
        form_data["adam_beta1"] = adam_beta1
    if adam_beta2:
        form_data["adam_beta2"] = adam_beta2
    if adam_weight_decay:
        form_data["adam_weight_decay"] = adam_weight_decay
    if adam_epsilon:
        form_data["adam_epsilon"] = adam_epsilon
    if max_grad_norm:
        form_data["max_grad_norm"] = max_grad_norm

    files = []

    files.extend(
        [('instance_image_list', (image.filename, await image.read(), image.content_type)) for image in
         instance_image_list])
    files.extend(
        [('class_image_list', (image.filename, await image.read(), image.content_type)) for image in class_image_list])

    json_response = requests.post(settings.AI_SERVER_URL + "/training/dreambooth", files=files, data=form_data).json()

    return {"task_id": json_response.get("task_id")}