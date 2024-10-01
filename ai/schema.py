from typing import Optional, List, Union

from pydantic import BaseModel


class CeleryTaskResponse(BaseModel):
    task_name: Optional[str] = None
    task_status: str
    task_arguments: Optional[dict] = None
    result_data_type: Optional[str] = None
    result_data: Optional[Union[List[str], str]] = None
    message: Optional[str] = None

    def __init__(self, **data):
        # 불필요한 키 제거
        if 'task_arguments' in data and data['task_arguments'] is not None:
            keys_to_remove = ["images", "init_image_files", "mask_image_files", "masks"]
            for key in keys_to_remove:
                data['task_arguments'].pop(key, None)

        super().__init__(**data)