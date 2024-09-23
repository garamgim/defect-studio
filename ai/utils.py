import zipfile
import io
from PIL import Image


def generate_zip_from_images(image_list: list[Image.Image]):
    zip_buffer = io.BytesIO()

    # ZIP_STORED : 압축 없이 저장
    # 이미지 파일은 이미 압축된 상태이므로, 빠른 압축 알고리즘을 사용하거나 압축을 아예 하지 않고 ZIP 포맷으로 묶어 보내는 것이 적합
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_STORED) as zipf:
        for index, image in enumerate(image_list):
            img_buffer = io.BytesIO()
            file_name = f"{index + 1}"

            if image.mode == "RGBA":
                # Remove Background의 산출물과 같이 RGBA로 되어있다면 알파 채널(투명도)을 지원하는 PNG로 변환
                image.save(img_buffer, format="PNG")
                file_name += ".png"
            else:
                # 투명도가 필요 없는 경우는 용량 대비 품질 효율이 좋은 JPEG로 저장
                image.save(img_buffer, format="JPEG")
                file_name += f".jpeg"

            img_buffer.seek(0)

            zipf.writestr(file_name, img_buffer.read())

    zip_buffer.seek(0)
    return zip_buffer


def get_scheduler(scheduler_name: str, pipeline_scheduler_config):
    if scheduler_name == "DPM++ 2M":
        from diffusers import DPMSolverMultistepScheduler
        return DPMSolverMultistepScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "DPM++ 2M Karras":
        from diffusers import DPMSolverMultistepScheduler
        return DPMSolverMultistepScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True)
    elif scheduler_name == "DPM++ 2M SDE":
        from diffusers import DPMSolverMultistepScheduler
        return DPMSolverMultistepScheduler.from_config(pipeline_scheduler_config, algorithm_type="sde-dpmsolver++")
    elif scheduler_name == "DPM++ 2M SDE Karras":
        from diffusers import DPMSolverMultistepScheduler
        return DPMSolverMultistepScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True, algorithm_type="sde-dpmsolver++")
    elif scheduler_name == "DPM++ SDE":
        from diffusers import DPMSolverSinglestepScheduler
        return DPMSolverSinglestepScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "DPM++ SDE Karras":
        from diffusers import DPMSolverSinglestepScheduler
        return DPMSolverSinglestepScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True)
    elif scheduler_name == "DPM2":
        from diffusers import KDPM2DiscreteScheduler
        return KDPM2DiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "DPM2 Karras":
        from diffusers import KDPM2DiscreteScheduler
        return KDPM2DiscreteScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True)
    elif scheduler_name == "DPM2 a":
        from diffusers import KDPM2AncestralDiscreteScheduler
        return KDPM2AncestralDiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "DPM2 a Karras":
        from diffusers import KDPM2AncestralDiscreteScheduler
        return KDPM2AncestralDiscreteScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True)
    elif scheduler_name == "Euler":
        from diffusers import EulerDiscreteScheduler
        return EulerDiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "Euler a":
        from diffusers import EulerAncestralDiscreteScheduler
        return EulerAncestralDiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "Heun":
        from diffusers import HeunDiscreteScheduler
        return HeunDiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "LMS":
        from diffusers import LMSDiscreteScheduler
        return LMSDiscreteScheduler.from_config(pipeline_scheduler_config)
    elif scheduler_name == "LMS Karras":
        from diffusers import LMSDiscreteScheduler
        return LMSDiscreteScheduler.from_config(pipeline_scheduler_config, use_karras_sigmas=True)
    else:
        raise ValueError("일치하는 이름의 스케줄러를 찾을 수 없습니다.")