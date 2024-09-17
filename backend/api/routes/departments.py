from fastapi import APIRouter
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from fastapi import Depends
from crud import members as members_crud, departments as departments_crud
from schema.members import MemberReadByDepartment
from models import Member

router = APIRouter(
    prefix="/departments",
    tags=["departments"]
)

@router.get("")
async def get_departments(session: Session = Depends(get_db)):
    return departments_crud.get_departments(session)

@router.get("/{department_id}/members")
async def get_members_by_department(department_id: int,
                                    session: Session = Depends(get_db),
                                    member: Member = Depends(get_current_user)):
    members = members_crud.get_members_by_department_id(session, department_id)
    member_reads = [MemberReadByDepartment.from_orm(member) for member in members]
    return member_reads