from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Servicio FastAPI en ejecución correctamente"}
