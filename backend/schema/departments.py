from pydantic import BaseModel
from models import Department

class DepartmentRead(BaseModel):
    department_id: int
    department_name: str

    @classmethod
    def from_orm(cls, department: 'Department') -> 'DepartmentRead':
        return cls(
            department_id=department.department_id,
            department_name=department.name
        )