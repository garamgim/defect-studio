from io import BytesIO

import torch.cuda
from fastapi import APIRouter, Request, HTTPException
from PIL import Image
from clip_interrogator import Interrogator, Config
from starlette.responses import JSONResponse

router = APIRouter(
    prefix="/clip"
)

@router.post("")
async def clip(request: Request):
    form = await request.form()
    model = form.get("model")
    images = form.getlist("images")
    mode = form.get("mode")
    caption = form.get("caption")
    batch_size = int(form.get("batch_size"))

    clip_config = Config(
        clip_model_name=model,
        cache_path="./cache",
        chunk_size=batch_size,
    )

    clip_config.apply_low_vram_defaults()
    clip_interrogator = Interrogator(clip_config)

    if torch.cuda.is_available():
        clip_interrogator.clip_model = clip_interrogator.clip_model.half()
        clip_interrogator.caption_model = clip_interrogator.caption_model.half()
    else:
        raise HTTPException(status_code=400, detail="CLIP API ERROR: GPU is not available.")

    prompts = []
    for image in images:
        image_bytes = await image.read()
        input_image = Image.open(BytesIO(image_bytes)).convert("RGB")

        if mode == "classic":
            prompt = clip_interrogator.interrogate_classic(input_image, caption=caption)
        elif mode == "fast":
            prompt = clip_interrogator.interrogate_fast(input_image, caption=caption)
        elif mode == "negative":
            prompt = clip_interrogator.interrogate_negative(input_image)
        else:
            prompt = clip_interrogator.interrogate(input_image, caption=caption)

        prompts.append(prompt)

    return JSONResponse(content={"prompts": prompts})
