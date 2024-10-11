from pathlib import Path
import tempfile
import shutil
from diffusers import StableDiffusionPipeline
import zipfile

from workers.celery import celery_app
from core.config import settings

@celery_app.task(name="download_model", queue="tra_queue")
def download_model(model_name, model_path):
    permanent_dir = Path(settings.DOWNLOAD_TEMP_DIR)
    permanent_model_path = permanent_dir / f"{model_name}.zip"

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_model_path = Path(temp_dir) / model_name
        temp_model_path.mkdir(parents=True, exist_ok=True)

        pipeline = StableDiffusionPipeline.from_pretrained(model_path)
        pipeline.save_pretrained(temp_model_path)

        with zipfile.ZipFile(permanent_model_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
            for file in temp_model_path.rglob('*'):
                zipf.write(file, arcname=file.relative_to(temp_model_path))

        return str(permanent_model_path)