import base64
import random
from io import BytesIO
from core.config import settings
from pathlib import Path

import PIL.Image
import torch
from diffusers import StableDiffusionImg2ImgPipeline
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from starlette.responses import StreamingResponse

from utils import get_scheduler, generate_zip_from_images

router = APIRouter(
    prefix="/img-to-img",
)


@router.post("")
async def image_to_image(
        request: Request
):
    form = await request.form()

    model = form.get("model")
    scheduler = form.get("scheduler")
    prompt = form.get("prompt")
    negative_prompt = form.get("negative_prompt")
    width = int(form.get("width"))
    height = int(form.get("height"))
    num_inference_steps = int(form.get("num_inference_steps"))
    guidance_scale = float(form.get("guidance_scale"))
    strength = float(form.get("strength"))
    seed = int(form.get("seed"))
    batch_count = int(form.get("batch_count"))
    batch_size = int(form.get("batch_size"))

    images = form.getlist("images")
    image_list = [PIL.Image.open(BytesIO(await file.read())).convert("RGB") for file in images]

    total_images = batch_size * batch_count * len(image_list)
    seeds = [(seed + i) % (2 ** 32) for i in range(total_images)]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model_dir = settings.OUTPUT_DIR
    model_path = Path(model_dir) / model

    i2i_pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to(device)
    if scheduler:
        i2i_pipe.scheduler = get_scheduler(scheduler, i2i_pipe.scheduler.config)

    generated_image_list = []

    for i in range(len(image_list)):
        curr_image_index = i * batch_count * batch_size
        for j in range(batch_count):
            current_seeds = seeds[curr_image_index + j * batch_size: curr_image_index + (j + 1) * batch_size]
            generators = [torch.Generator(device=device).manual_seed(s) for s in current_seeds]

            images = i2i_pipe(
                image=image_list[i],
                prompt=prompt,
                negative_prompt=negative_prompt,
                width=width,
                height=height,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                strength=strength,
                generators=generators,
                num_images_per_prompt=len(generators),
            ).images

            generated_image_list.extend(images)

    zip_buffer = generate_zip_from_images(generated_image_list)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=images.zip"
    })
