import base64
import os
from typing import List
from pathlib import Path
import re
import mimetypes

from fastapi import status, HTTPException


def get_file_list_from_path(input_path):
    if not input_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="로컬 파일 경로를 지정해주세요.")

    image_files = [file for file in Path(input_path).glob("*") if
                   re.search(r"\.(png|jpg|jpeg|jfif)$", file.suffix, re.IGNORECASE)]
    if not image_files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="유효한 이미지가 없습니다.")

    files = []
    for image_file in image_files:
        with open(image_file, "rb") as f:
            image_bytes = f.read()

            mime_type, _ = mimetypes.guess_type(image_file.name)
            if mime_type is None:
                mime_type = "application/octet-stream"

            files.append(("images", (image_file.name, image_bytes, mime_type)))

    return files


def save_file_list_to_path(output_path: str, image_list: List[str]):
    if not output_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="로컬 파일 경로를 지정해주세요.")

    os.makedirs(output_path, exist_ok=True)

    try:
        for index, image_data in enumerate(image_list):
            image_bytes = base64.b64decode(image_data)
            image_filename = os.path.join(output_path, f"{index}.jpg")
            with open(image_filename, "wb") as image_file:
                image_file.write(image_bytes)
        return True

    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="파일 경로를 찾을 수 없습니다.")

    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="파일을 생성할 권한이 없습니다.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"파일 생성 중 알 수 없는 오류가 발생했습니다: {e}")
