from fastapi import APIRouter, Request

from utils.tasks import clip_task

router = APIRouter(
    prefix="/clip"
)


@router.post("")
async def clip(request: Request):
    form = await request.form()

    images = form.getlist("images")

    bytes_image_list = []
    for image in images:
        contents = image.file.read()
        bytes_image_list.append(contents)
        image.file.close()

    form_data = {
        "model": form.get("model"),
        "gpu_device": int(form.get("gpu_device")),
        "mode": form.get("mode"),
        "caption": form.get("caption"),
        "images": bytes_image_list,
        "batch_size": int(form.get("batch_size"))
    }

    task = clip_task.apply_async(kwargs=form_data)

    return {"task_id": task.id}
