import base64
import random
from io import BytesIO

import PIL.Image
import torch
from diffusers import AutoPipelineForInpainting
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from utils import get_scheduler

router = APIRouter(
    prefix="/inpainting",
)


@router.post("")
async def inpainting(
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
    init_image_files = form.getlist("init_image")
    mask_image_files = form.getlist("mask_image")
    seed = int(form.get("seed"))
    batch_count = int(form.get("batch_count"))
    batch_size = int(form.get("batch_size"))

    init_image_list = [PIL.Image.open(BytesIO(await file.read())).convert("RGB") for file in init_image_files]
    mask_image_list = [PIL.Image.open(BytesIO(await file.read())).convert("RGB") for file in mask_image_files]

    if seed == -1:
        seed = random.randint(0, 2 ** 32 - 1)

    total_images = batch_size * batch_count
    seeds = [seed + i for i in range(total_images)]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    inpaint_pipe = AutoPipelineForInpainting.from_pretrained(model, torch_dtype=torch.float16).to(device)
    if scheduler:
        inpaint_pipe.scheduler = get_scheduler(scheduler, inpaint_pipe.scheduler.config)

    generated_image_list = []

    for i in range(len(init_image_list)):
        curr_image_index = i * batch_count * batch_size
        for j in range(batch_count):
            current_seeds = seeds[curr_image_index + j * batch_size: curr_image_index + (j + 1) * batch_size]
            generators = [torch.Generator(device=device).manual_seed(s) for s in current_seeds]

            images = inpaint_pipe(
                image=init_image_list[i],
                mask_image=mask_image_list[i],
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

    encoded_images = []

    for image in generated_image_list:
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        encoded_images.append(img_str)

    return JSONResponse(content={"image_list": encoded_images})
