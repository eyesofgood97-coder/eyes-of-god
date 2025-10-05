from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route import include_routes

app = FastAPI(
    title="Mi API",
    description="API con rutas organizadas",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Incluir todas las rutas
include_routes(app)