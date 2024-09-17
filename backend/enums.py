import enum

class Role(enum.Enum):
    super_admin = "super_admin"
    department_admin = "department_admin"
    department_member = "department_member"
    guest = "guest"

class LogType(enum.Enum):
    use = "use"
    distribute = "distribute"
    issue = "issue"

class UseType(enum.Enum):
    text_to_image = "text_to_image"
    image_to_image = "image_to_image"
    inpainter = "inpainter"
    remove_background = "remove_background"
    clip = "clip"
    clean_up = "clean_up"

class GPUEnvironment(enum.Enum):
    local = "local"
    remote = "remote"

class SchedulerType(enum.Enum):
    dpmpp_2m = "DPM++ 2M"
    dpmpp_2m_karras = "DPM++ 2M Karras"
    dpmpp_2m_sde = "DPM++ 2M SDE"
    dpmpp_2m_sde_karras = "DPM++ 2M SDE Karras"
    dpmpp_sde = "DPM++ SDE"
    dpmpp_sde_karras = "DPM++ SDE Karras"
    dpm2 = "DPM2"
    dpm2_karras = "DPM2 Karras"
    dpm2_a = "DPM2 a"
    dpm2_a_karras = "DPM2 a Karras"
    euler = "Euler"
    euler_a = "Euler a"
    heun = "Heun"
    lms = "LMS"
    lms_karras = "LMS Karras"

class GenerationType(enum.Enum):
    text_to_image = "text_to_image"
    image_to_image = "image_to_image"
    inpainting = "inpainting"
    remove_background = "remove_background"
    clean_up = "clean_up"
