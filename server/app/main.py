from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import astro

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

#  uvicorn main:app --host 0.0.0.0 --port 8000
# npx tunnelmole 8000


app.include_router(astro.router, prefix="/astro")
