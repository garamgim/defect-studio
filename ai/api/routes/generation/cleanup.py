from fastapi import APIRouter, Request

from utils.tasks import cleanup_task

router = APIRouter(
    prefix="/cleanup",
)


@router.post("")
async def cleanup(request: Request):
    form = await request.form()

    images = form.getlist("images")
    bytes_init_image_list = []
    for image in images:
        contents = image.file.read()
        bytes_init_image_list.append(contents)
        image.file.close()

    masks = form.getlist("masks")
    bytes_mask_image_list = []
    for image in masks:
        contents = image.file.read()
        bytes_mask_image_list.append(contents)
        image.file.close()

    form_data = {
        "images": bytes_init_image_list,
        "masks": bytes_mask_image_list,
        "gpu_device": int(form.get("gpu_device")),
    }

    task = cleanup_task.apply_async(kwargs=form_data)

    return {"task_id": task.id}
