from fastapi import APIRouter, Request

from workers.tasks.generation import remove_bg_task

router = APIRouter(
    prefix="/remove-bg"
)


@router.post("")
async def remove_bg(request: Request):
    form = await request.form()

    images = form.getlist("images")

    bytes_image_list = []
    for image in images:
        contents = image.file.read()
        bytes_image_list.append(contents)
        image.file.close()

    form_data = {
        "model": form.get("model", "briaai/RMBG-1.4"),
        "gpu_device": int(form.get("gpu_device")),
        "batch_size": int(form.get("batch_size")),
        "images": bytes_image_list
    }

    task = remove_bg_task.apply_async(kwargs=form_data)

    return {"task_id": task.id}
