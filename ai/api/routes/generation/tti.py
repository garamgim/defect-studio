import base64
import random
from io import BytesIO

import torch
from diffusers import StableDiffusionPipeline
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from utils import get_scheduler

router = APIRouter(
    prefix="/txt-to-img",
)

@router.post("")
async def text_to_image(request: Request):
    form = await request.form()
    print(form)

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
    t2i_pipe = StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float16).to(device)

    if scheduler:
        t2i_pipe.scheduler = get_scheduler(scheduler, t2i_pipe.scheduler.config)

    if seed == -1:
        seed = random.randint(0, 2 ** 32 - 1)

    image_list = []
    metadata = []

    total_images = batch_size * batch_count
    seeds = [seed + i for i in range(total_images)]

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

        image_list.extend(images)

        for j in range(batch_size):
            metadata.append({
                'batch': i,
                'image_index': j,
                'seed': current_seeds[j],
                'num_inference_steps': num_inference_steps,
                'guidance_scale': guidance_scale,
                'prompt': prompt
            })

    encoded_images = []

    for image in image_list:
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        encoded_images.append(img_str)

    return JSONResponse(content={"image_list": encoded_images, "metadata": metadata})
