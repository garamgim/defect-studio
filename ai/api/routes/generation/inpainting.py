from fastapi import APIRouter, Request

from workers.tasks.generation import inpainting_task

router = APIRouter(
    prefix="/inpainting",
)


@router.post("")
async def inpainting(
        request: Request
):
    form = await request.form()

    init_image_files = form.getlist("init_image")

    bytes_init_image_list = []
    for image in init_image_files:
        contents = image.file.read()
        bytes_init_image_list.append(contents)
        image.file.close()

    mask_image_files = form.getlist("mask_image")
    bytes_mask_image_list = []
    for image in mask_image_files:
        contents = image.file.read()
        bytes_mask_image_list.append(contents)
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
        "init_image_files": bytes_init_image_list,
        "mask_image_files": bytes_mask_image_list,
        "seed": int(form.get("seed")),
        "batch_count": int(form.get("batch_count")),
        "batch_size": int(form.get("batch_size"))
    }

    task = inpainting_task.apply_async(kwargs=form_data)

    return {"task_id": task.id}
