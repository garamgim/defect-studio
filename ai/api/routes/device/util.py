from fastapi import APIRouter, status, Form, HTTPException
from starlette.responses import JSONResponse
import torch
import nvidia_smi

router = APIRouter()


@router.get("/health")
async def health():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"health": "good"})


@router.get("/cuda_available")
async def cuda_available():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"cuda_available": torch.cuda.is_available()})

@router.get("/cuda_usage")
async def cuda_usage():
    # NVML 초기화
    nvidia_smi.nvmlInit()

    # GPU 장치 수 가져오기
    deviceCount = nvidia_smi.nvmlDeviceGetCount()

    # 결과를 저장할 리스트
    gpu_info = []

    # 각 GPU의 메모리 정보 조회
    for i in range(deviceCount):
        handle = nvidia_smi.nvmlDeviceGetHandleByIndex(i)
        info = nvidia_smi.nvmlDeviceGetMemoryInfo(handle)
        name = nvidia_smi.nvmlDeviceGetName(handle).decode("utf-8")  # GPU 이름을 문자열로 변환
        free_memory = info.free / (1024 ** 2)  # 여유 메모리(MB)
        used_memory = info.used / (1024 ** 2)  # 사용 중인 메모리(MB)
        total_memory = info.total / (1024 ** 2)  # 총 메모리(MB)
        used_memory_percentage = 100 * info.used / info.total  # 사용 메모리 비율 (%)
        free_memory_percentage = 100 * info.free / info.total  # 여유 메모리 비율 (%)

        # 각 GPU의 정보 저장
        gpu_info.append({
            "GPU num": i,
            "GPU name": name,
            "Total memory (MB)": total_memory,
            "Free memory (MB)": free_memory,
            "Used memory (MB)": used_memory,
            "Free memory (%)": free_memory_percentage,
            "Used memory (%)": used_memory_percentage,
        })

    # NVML 종료
    nvidia_smi.nvmlShutdown()

    # JSON 응답 반환
    return JSONResponse(status_code=status.HTTP_200_OK, content={"gpu_info": gpu_info})

@router.post("/set_device")
async def set_device(device_num: int = Form(...)):  # Form 데이터로 device_num을 받음
    device_count = torch.cuda.device_count()

    # GPU가 있는지 확인
    if device_count == 0:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "No CUDA devices available"})

    # device_num 유효성 검사
    if device_num < 0 or device_num >= device_count:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": f"Invalid device_num. Available GPU index range is 0 to {device_count - 1}.",
                "device_count": device_count
            }
        )

    # GPU 설정
    torch.cuda.set_device(device_num)
    current_device = torch.cuda.current_device()

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "CUDA device set",
            "current_device": current_device,
            "device_count": device_count
        }
    )