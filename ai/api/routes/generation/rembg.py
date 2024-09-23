import torch
from PIL import Image
from fastapi import APIRouter, HTTPException, Request, status
from starlette.responses import StreamingResponse
from transformers import pipeline

from utils import generate_zip_from_images

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

    generated_image_list = []

    for i in range(0, len(images), batch_size):
        batch_images = images[i:i+batch_size]
        input_images = [Image.open(image.file).convert("RGBA") for image in batch_images]
        output_images = rmbg_pipeline(input_images)
        generated_image_list.extend(output_images)

    zip_buffer = generate_zip_from_images(generated_image_list)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=images.zip"
    })
