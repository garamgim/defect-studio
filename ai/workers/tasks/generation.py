import gc
import os
import subprocess
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory

import PIL.Image
import torch
import torch.cuda
from PIL import Image
from clip_interrogator import Interrogator, Config
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, AutoPipelineForInpainting
from fastapi import HTTPException, status
from transformers import pipeline

from core.config import settings
from workers.celery import celery_app
from utils.scheduler import get_scheduler
from utils.zip import generate_zip_from_images


@celery_app.task(name="text_to_image", queue="gen_queue")
def text_to_image_task(
        model, gpu_device, scheduler, prompt, negative_prompt, width, height,
        num_inference_steps, guidance_scale, seed, batch_count, batch_size
):
    torch.cuda.set_device(gpu_device)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_dir = settings.OUTPUT_DIR
    model_path = Path(model_dir) / model

    t2i_pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to(device)

    if scheduler:
        t2i_pipe.scheduler = get_scheduler(scheduler, t2i_pipe.scheduler.config)

    print("After loading model:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")
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

        print("After processing batch:")
        print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
        print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
        print("-----------")

    zip_buffer = generate_zip_from_images(generated_image_list)

    del t2i_pipe
    print("After deleting pipe:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    gc.collect()
    print("After garbage collection:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.empty_cache()
    print("After empty_cache:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.ipc_collect()
    print("After ipc_collect:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    return zip_buffer


@celery_app.task(name="image_to_image", queue="gen_queue")
def image_to_image_task(
        model, gpu_device, scheduler, prompt, negative_prompt, width, height,
        num_inference_steps, guidance_scale, strength, seed,
        batch_count, batch_size, images
):
    torch.cuda.set_device(gpu_device)

    image_list = [PIL.Image.open(BytesIO(image_bytes)).convert("RGB") for image_bytes in images]

    total_images = batch_size * batch_count * len(image_list)
    seeds = [(seed + i) % (2 ** 32) for i in range(total_images)]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model_dir = settings.OUTPUT_DIR
    model_path = Path(model_dir) / model

    i2i_pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to(device)
    if scheduler:
        i2i_pipe.scheduler = get_scheduler(scheduler, i2i_pipe.scheduler.config)

    print("After loading model:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

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

    del i2i_pipe
    print("After deleting pipe:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    gc.collect()
    print("After garbage collection:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.empty_cache()
    print("After empty_cache:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.ipc_collect()
    print("After ipc_collect:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    return zip_buffer


@celery_app.task(name="inpainting", queue="gen_queue")
def inpainting_task(
        model, gpu_device, scheduler, prompt, negative_prompt, width, height,
        num_inference_steps, guidance_scale, strength, seed,
        batch_count, batch_size, init_image_files, mask_image_files
):
    torch.cuda.set_device(gpu_device)

    init_image_list = [PIL.Image.open(BytesIO(image_bytes)).convert("RGB") for image_bytes in init_image_files]
    mask_image_list = [PIL.Image.open(BytesIO(image_bytes)).convert("RGB") for image_bytes in mask_image_files]

    total_images = batch_size * batch_count * len(init_image_list)
    seeds = [(seed + i) % (2 ** 32) for i in range(total_images)]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model_dir = settings.OUTPUT_DIR
    model_path = Path(model_dir) / model

    inpaint_pipe = AutoPipelineForInpainting.from_pretrained(model_path, torch_dtype=torch.float16).to(device)
    if scheduler:
        inpaint_pipe.scheduler = get_scheduler(scheduler, inpaint_pipe.scheduler.config)

    print("After loading model:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

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

    zip_buffer = generate_zip_from_images(generated_image_list)

    del inpaint_pipe
    print("After deleting pipe:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    gc.collect()
    print("After garbage collection:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.empty_cache()
    print("After empty_cache:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.ipc_collect()
    print("After ipc_collect:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    return zip_buffer


@celery_app.task(name="clean_up", queue="gen_queue")
def cleanup_task(gpu_device, images, masks, model):
    torch.cuda.set_device(gpu_device)

    print("Before RUN:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    if len(images) != len(masks):
        raise HTTPException(status_code=400, detail="이미지 수와 마스크 수가 일치하지 않습니다.")

    with TemporaryDirectory() as temp_output_dir, \
            TemporaryDirectory() as temp_image_dir, \
            TemporaryDirectory() as temp_mask_dir:

        image_paths = []
        mask_paths = []

        for index, (image_bytes, mask_bytes) in enumerate(zip(images, masks)):
            filename = f"image_{index}.png"

            temp_image_path = os.path.join(temp_image_dir, filename)
            temp_mask_path = os.path.join(temp_mask_dir, filename)

            input_image = Image.open(BytesIO(image_bytes)).convert("RGBA")
            input_mask = Image.open(BytesIO(mask_bytes)).convert("RGBA")

            input_image.save(temp_image_path)
            input_mask.save(temp_mask_path)

            image_paths.append(temp_image_path)
            mask_paths.append(temp_mask_path)

        device = "cuda" if torch.cuda.is_available() else "cpu"

        cmd = [
            "iopaint", "run",
            "--model=lama",
            # f"--device={device}",
            f"--device=cpu",
            f"--image={temp_image_dir}",
            f"--mask={temp_mask_dir}",
            f"--output={temp_output_dir}"
        ]

        result = subprocess.run(cmd, check=True)

        print("After RUN:")
        print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
        print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
        print("-----------")

        if result.returncode == 0:
            output_images = []

            for filename in os.listdir(temp_output_dir):
                output_image_path = os.path.join(temp_output_dir, filename)
                output_image = Image.open(output_image_path)
                output_images.append(output_image)

            zip_buffer = generate_zip_from_images(output_images)

            return zip_buffer
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"cleanup 중 오류가 발생했습니다. : {result.returncode}")


@celery_app.task(name="remove_background", queue="gen_queue")
def remove_bg_task(gpu_device, model, batch_size, images):
    torch.cuda.set_device(gpu_device)

    if not images:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미지를 첨부해주세요.")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    rmbg_pipeline = pipeline("image-segmentation",
                             model=model,
                             trust_remote_code=True,
                             device=device)

    print("After loading model:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    generated_image_list = []

    for i in range(0, len(images), batch_size):
        batch_images = images[i:i + batch_size]
        input_images = [Image.open(BytesIO(image_bytes)).convert("RGBA") for image_bytes in batch_images]
        output_images = rmbg_pipeline(input_images)
        generated_image_list.extend(output_images)

    zip_buffer = generate_zip_from_images(generated_image_list)

    del rmbg_pipeline
    print("After deleting pipe:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    gc.collect()
    print("After garbage collection:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.empty_cache()
    print("After empty_cache:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.ipc_collect()
    print("After ipc_collect:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    return zip_buffer


@celery_app.task(name="clip", queue="gen_queue")
def clip_task(model, gpu_device, batch_size, images, mode, caption):
    torch.cuda.set_device(gpu_device)

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

    print("After loading model:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    prompts = []
    for image_bytes in images:
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

    del clip_interrogator
    print("After deleting interrogator:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    gc.collect()
    print("After garbage collection:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.empty_cache()
    print("After empty_cache:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    torch.cuda.ipc_collect()
    print("After ipc_collect:")
    print(f"Allocated Memory: {torch.cuda.memory_allocated() / (1024 ** 2):.2f} MB")
    print(f"Reserved Memory: {torch.cuda.memory_reserved() / (1024 ** 2):.2f} MB")
    print("-----------")

    return prompts
