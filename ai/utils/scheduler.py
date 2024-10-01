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