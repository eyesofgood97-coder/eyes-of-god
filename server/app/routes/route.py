from fastapi import FastAPI
from api import astro, earth_data

def include_routes(app: FastAPI):
    """
    Incluye todos los routers en la aplicación
    """
    # Router de astronomía
    app.include_router(
        astro.router,
        prefix="/astro",
        tags=["Astronomía"]
    )

    app.include_router(
        earth_data.router,
        prefix="/earthdata",
        tags=["EarthData"]
    )
    
    # Puedes agregar más routers aquí
    print("✅ Todas las rutas incluidas correctamente")