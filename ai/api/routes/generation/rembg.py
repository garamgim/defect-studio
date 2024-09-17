import base64
import torch
from io import BytesIO
from fastapi import APIRouter, HTTPException, Request, status
from PIL import Image
from starlette.responses import JSONResponse
from transformers import pipeline

router = APIRouter(
    prefix="/remove-bg"
)

@router.post("")
async def remove_bg(request: Request):
    form = await request.form()

    model = form.get("model", "briaai/RMBG-1.4")
    batch_size = int(form.get("batch_size"))
    images = form.getlist("images")

    if not images:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미지를 첨부해주세요.")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    rmbg_pipeline = pipeline("image-segmentation",
                             model=model,
                             trust_remote_code=True,
                             device=device)

    encoded_images = []
    for i in range(0, len(images), batch_size):
        batch_images = images[i:i+batch_size]
        input_images = [Image.open(image.file).convert("RGBA") for image in batch_images]
        output_images = rmbg_pipeline(input_images)

        for output_image in output_images:
            buffered = BytesIO()
            output_image.save(buffered, format="PNG")
            buffered.seek(0)

            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            encoded_images.append(img_str)

    return JSONResponse(content={"image_list": encoded_images})