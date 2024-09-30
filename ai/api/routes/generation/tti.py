import torch
from diffusers import StableDiffusionPipeline
from fastapi import APIRouter, Request
from core.config import settings
from pathlib import Path
from starlette.responses import StreamingResponse

from utils import get_scheduler, generate_zip_from_images

router = APIRouter(
    prefix="/txt-to-img",
)

@router.post("")
async def text_to_image(request: Request):
    form = await request.form()

    model = form.get("model")
    scheduler = form.get("scheduler")
    prompt = form.get("prompt")
    negative_prompt = form.get("negative_prompt")
    width = int(form.get("width"))
    height = int(form.get("height"))
    num_inference_steps = int(form.get("num_inference_steps"))
    guidance_scale = float(form.get("guidance_scale"))
    seed = int(form.get("seed"))
    batch_count = int(form.get("batch_count"))
    batch_size = int(form.get("batch_size"))

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_dir = settings.OUTPUT_DIR
    model_path = Path(model_dir) / model
    
    t2i_pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to(device)

    if scheduler:
        t2i_pipe.scheduler = get_scheduler(scheduler, t2i_pipe.scheduler.config)

    total_images = batch_size * batch_count
    seeds = [(seed + i) % (2 ** 32) for i in range(total_images)]

    generated_image_list = []

    for i in range(batch_count):
        current_seeds = seeds[i * batch_size: (i + 1) * batch_size]
        generators = [torch.Generator(device=device).manual_seed(s) for s in current_seeds]

        images = t2i_pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            generator=generators,
            num_images_per_prompt=len(generators),
        ).images

        generated_image_list.extend(images)

    zip_buffer = generate_zip_from_images(generated_image_list)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=images.zip"
    })
