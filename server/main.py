from fastapi import FastAPI, Depends
from sqlalchemy import text
from config.connect import get_db

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Servicio FastAPI activo"}

@app.get("/db-health")
def db_health_check(db=Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Conexión a la base de datos exitosa"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
