from fastapi import APIRouter

router = APIRouter(tags=["astros"])

@router.get("/")
async def home():
    return 'Hola Mundo'