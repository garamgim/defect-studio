from fastapi import APIRouter, Request

from workers.tasks.generation import image_to_image_task

router = APIRouter(
    prefix="/img-to-img",
)


@router.post("")
async def image_to_image(
        request: Request
):
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
        "scheduler": form.get("scheduler"),
        "prompt": form.get("prompt"),
        "negative_prompt": form.get("negative_prompt"),
        "width": int(form.get("width")),
        "height": int(form.get("height")),
        "num_inference_steps": int(form.get("num_inference_steps")),
        "guidance_scale": float(form.get("guidance_scale")),
        "strength": float(form.get("strength")),
        "seed": int(form.get("seed")),
        "batch_count": int(form.get("batch_count")),
        "batch_size": int(form.get("batch_size")),
        "images": bytes_image_list
    }

    task = image_to_image_task.apply_async(kwargs=form_data)

    return {"task_id": task.id}
