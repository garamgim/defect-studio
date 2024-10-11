from datetime import datetime
from typing import Optional, List

from beanie import Document, PydanticObjectId
from pydantic import BaseModel

from enums import GenerationType


class GenerationLog(Document):
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
    member_id: int
    date: datetime
    num_of_generated_images: int
    image_url_list: List[str]


class SimpleGenerationLog(BaseModel):
    id: PydanticObjectId
    generation_type: GenerationType
    date: datetime
    prompt: Optional[str]
    num_of_generated_images: int
    first_image_url: str

    @classmethod
    def from_orm(cls, log: 'GenerationLog') -> 'SimpleGenerationLog':
        return cls(
            id=log.id,
            generation_type=log.generation_type,
            date=log.date,
            prompt=log.prompt,
            num_of_generated_images=log.num_of_generated_images,
            first_image_url=log.image_url_list[0] if log.image_url_list else None,
        )
