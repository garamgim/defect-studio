from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import BaseModel

from enums import GenerationType


class GenerationPreset(Document):
    preset_title: str
    generation_type: GenerationType
    model: Optional[str] = None
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    batch_count: Optional[int] = None
    batch_size: Optional[int] = None
    strength: Optional[float] = None
    guidance_scale: Optional[float] = None
    num_inference_steps: Optional[int] = None
    scheduler: Optional[str] = None
    seed: Optional[int] = None
    member_id: Optional[int] = None
    date: datetime = datetime.today()

class GenerationPresetUpdate(BaseModel):
    model: Optional[str] = None
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    batch_count: Optional[int] = None
    batch_size: Optional[int] = None
    strength: Optional[float] = None
    guidance_scale: Optional[float] = None
    num_inference_steps: Optional[int] = None
    scheduler: Optional[str] = None
    seed: Optional[int] = None
