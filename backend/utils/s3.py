import datetime
import time
from io import BytesIO
from typing import List

import aioboto3
import boto3
from PIL import Image
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException

from core.config import settings


# 동기 방식

def upload_files(image_list: List[BytesIO], formatted_date: str, formatted_time: str) -> List[str]:
    start_time = time.time()
    print("s3 not async upload started")
    s3_urls = []
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_S3_SECRET_KEY
    )

    for index, image_stream in enumerate(image_list):
        image_key = f"{formatted_date}/{formatted_time}/{index + 1}"
        image_stream.seek(0)

        url = upload_file(s3_client, image_stream, image_key)
        if url:
            s3_urls.append(url)
    print(f"Upload completed in {time.time() - start_time} seconds")
    return s3_urls

def upload_file(s3_client, image_stream: BytesIO, key: str) -> str:
    image_stream.seek(0)
    image = Image.open(image_stream)
    format = image.format.lower()

    try:
        image_stream.seek(0)
        s3_client.upload_fileobj(
            image_stream,
            settings.AWS_S3_BUCKET,
            f"{key}.{format}",
            ExtraArgs={
                'ContentType': f'image/{format}',
                'ContentDisposition': 'inline'
            }
        )
        s3_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION_STATIC}.amazonaws.com/{key}.{format}"
        return s3_url
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"업로드 실패: {e}")

def delete_files(num_of_images: int, image_url_list: List[str]):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_S3_SECRET_KEY
    )

    for url in image_url_list:
        delete_file(s3_client, url.split(".com/")[-1])

def delete_file(s3_client, key: str):
    try:
        s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"삭제 실패: {e}")


# 비동기 방식

async def upload_files_async(image_list: List[BytesIO], formatted_date: str, formatted_time: str) -> List[str]:
    start_time = time.time()
    print("s3 async upload started")
    s3_urls = []
    session = aioboto3.Session()
    async with session.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_S3_SECRET_KEY
    ) as s3_client:

        for index, image_stream in enumerate(image_list):
            image_key = f"{formatted_date}/{formatted_time}/{index + 1}"
            image_stream.seek(0)

            url = await upload_file_async(s3_client, image_stream, image_key)
            if url:
                s3_urls.append(url)
    print(f"Upload completed in {time.time() - start_time} seconds")
    return s3_urls

async def upload_file_async(s3_client, image_stream: BytesIO, key: str) -> str:
    image_stream.seek(0)
    image = Image.open(image_stream)
    format = image.format.lower()
    try:
        image_stream.seek(0)
        await s3_client.upload_fileobj(
            image_stream,
            settings.AWS_S3_BUCKET,
            f"{key}.{format}",
            ExtraArgs={
                'ContentType': f'image/{format}',
                'ContentDisposition': 'inline'
            }
        )
        s3_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION_STATIC}.amazonaws.com/{key}.{format}"
        return s3_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"업로드 실패: {e}")

async def delete_files_async(image_url_list: List[str]):
    session = aioboto3.Session()
    async with session.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_S3_SECRET_KEY
    ) as s3_client:
        for url in image_url_list:
            await delete_file_async(s3_client, url)

async def delete_file_async(s3_client, url: str):
    try:
        await s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=url.split(".com/")[-1])
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"삭제 실패: {e}")
