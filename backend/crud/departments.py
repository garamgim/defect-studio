from fastapi import Depends
from dependencies import get_db
from models import Department
from schema.departments import DepartmentRead

def get_departments(session: Depends(get_db)):
    departments = session.query(Department).all()
    department_reads = [DepartmentRead.from_orm(department) for department in departments]
    return department_reads