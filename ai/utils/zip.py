import zipfile
import io
from PIL import Image


def generate_zip_from_images(image_list: list[Image.Image]):
    zip_buffer = io.BytesIO()

    # ZIP_STORED : 압축 없이 저장
    # 이미지 파일은 이미 압축된 상태이므로, 빠른 압축 알고리즘을 사용하거나 압축을 아예 하지 않고 ZIP 포맷으로 묶어 보내는 것이 적합
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_STORED) as zipf:
        for index, image in enumerate(image_list):
            img_buffer = io.BytesIO()
            file_name = f"{index + 1}"

            if image.mode == "RGBA":
                # Remove Background의 산출물과 같이 RGBA로 되어있다면 알파 채널(투명도)을 지원하는 PNG로 변환
                image.save(img_buffer, format="PNG")
                file_name += ".png"
            else:
                # 투명도가 필요 없는 경우는 용량 대비 품질 효율이 좋은 JPEG로 저장
                image.save(img_buffer, format="JPEG")
                file_name += f".jpeg"

            img_buffer.seek(0)

            zipf.writestr(file_name, img_buffer.read())

    zip_buffer.seek(0)
    return zip_buffer


