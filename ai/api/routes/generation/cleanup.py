from fastapi import APIRouter, Request, HTTPException, status
from PIL import Image
from io import BytesIO
from starlette.responses import JSONResponse
from tempfile import TemporaryDirectory
import subprocess, os, base64, torch

router = APIRouter(
    prefix="/cleanup",
)

@router.post("")
async def cleanup(request: Request):
    form = await request.form()
    images = form.getlist("images")
    masks = form.getlist("masks")

    if len(images) != len(masks):
        raise HTTPException(status_code=400, detail="이미지 수와 마스크 수가 일치하지 않습니다.")

    with TemporaryDirectory() as temp_output_dir,\
        TemporaryDirectory() as temp_image_dir,\
        TemporaryDirectory() as temp_mask_dir:

        image_paths = []
        mask_paths = []

        for index, (image, mask) in enumerate(zip(images, masks)):
            image_filename = f"image_{index}.png"
            mask_filename = f"image_{index}.png"

            temp_image_path = os.path.join(temp_image_dir, image_filename)
            temp_mask_path = os.path.join(temp_mask_dir, mask_filename)

            input_image = Image.open(image.file).convert("RGBA")
            input_mask = Image.open(mask.file).convert("RGBA")

            input_image.save(temp_image_path)
            input_mask.save(temp_mask_path)

            image_paths.append(temp_image_path)
            mask_paths.append(temp_mask_path)

        device = "cuda" if torch.cuda.is_available() else "cpu"

        cmd = [
            "iopaint", "run",
            "--model=lama",
            f"--device={device}",
            f"--image={temp_image_dir}",
            f"--mask={temp_mask_dir}",
            f"--output={temp_output_dir}"
        ]

        result = subprocess.run(cmd, shell=True)

        if result.returncode == 0:
            output_images = []
            for filename in os.listdir(temp_output_dir):
                output_image_path = os.path.join(temp_output_dir, filename)
                output_image = Image.open(output_image_path)

                buffered = BytesIO()
                output_image.save(buffered, format="PNG")
                buffered.seek(0)

                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                output_images.append(img_str)

            return JSONResponse(content={"image_list": output_images})

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"cleanup 중 오류가 발생했습니다. : {result.returncode}")