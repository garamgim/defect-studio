from fastapi import APIRouter
from .routes import auth, members, admin, departments
from .routes.generation import main as generation
from .routes.device import main as device
from .routes.training import main as training

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(members.router)
api_router.include_router(admin.router)
api_router.include_router(generation.router)
api_router.include_router(departments.router)
api_router.include_router(training.router)
api_router.include_router(device.router)