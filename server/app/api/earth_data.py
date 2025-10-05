from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel, HttpUrl
import requests
from typing import Optional
from pathlib import Path

from core.config import EARTHDATA_PASSWORD, EARTHDATA_USERNAME

DOWNLOAD_DIR = Path("downloads")
DOWNLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()

class SessionWithHeaderRedirection(requests.Session):
    """
    Clase personalizada para mantener headers durante redirecciones
    a servidores de autenticación de NASA
    """
    AUTH_HOST = 'urs.earthdata.nasa.gov'

    def __init__(self, username: str, password: str):
        super().__init__()
        self.auth = (username, password)

    def rebuild_auth(self, prepared_request, response):
        """
        Mantiene la autorización solo cuando redirige a/desde el host de NASA
        """
        headers = prepared_request.headers
        url = prepared_request.url

        if 'Authorization' in headers:
            original_parsed = requests.utils.urlparse(response.request.url)
            redirect_parsed = requests.utils.urlparse(url)

            # Solo elimina autorización si redirige fuera de NASA
            if (original_parsed.hostname != redirect_parsed.hostname) and \
                    redirect_parsed.hostname != self.AUTH_HOST and \
                    original_parsed.hostname != self.AUTH_HOST:
                del headers['Authorization']


class DownloadRequest(BaseModel):
    """Modelo para solicitudes de descarga"""
    url: HttpUrl


class FileInfo(BaseModel):
    """Información del archivo descargado"""
    filename: str
    size_bytes: int
    status: str


@router.get("/")
async def root():
    """Endpoint de bienvenida"""
    return {
        "message": "Earthdata Downloader API",
        "endpoints": {
            "/download": "POST - Descarga archivo y lo guarda en servidor",
            "/stream": "POST - Stream directo del archivo",
            "/list": "GET - Lista archivos descargados",
            "/file/{filename}": "GET - Descarga archivo guardado"
        }
    }


@router.post("/download", response_model=FileInfo)
async def download_file(request: DownloadRequest, background_tasks: BackgroundTasks):
    """
    Descarga un archivo de Earthdata y lo guarda en el servidor
    
    Args:
        request: URL del archivo y credenciales opcionales
    
    Returns:
        Información del archivo descargado
    """
    # Usar credenciales del request o las por defecto
    username = EARTHDATA_USERNAME
    password = EARTHDATA_PASSWORD
    
    # Extraer nombre del archivo de la URL
    url_str = str(request.url)
    filename = url_str[url_str.rfind('/') + 1:]
    filepath = DOWNLOAD_DIR / filename
    
    try:
        # Crear sesión con autenticación
        session = SessionWithHeaderRedirection(username, password)
        
        # Realizar petición con streaming
        response = session.get(url_str, stream=True)
        response.raise_for_status()
        
        # Guardar archivo por chunks
        file_size = 0
        with open(filepath, 'wb') as fd:
            for chunk in response.iter_content(chunk_size=1024*1024):  # 1MB chunks
                if chunk:
                    fd.write(chunk)
                    file_size += len(chunk)
        
        return FileInfo(
            filename=filename,
            size_bytes=file_size,
            status="downloaded"
        )
        
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, 
                          detail=f"Error descargando archivo: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, 
                          detail=f"Error inesperado: {str(e)}")


@router.post("/stream")
async def stream_file(request: DownloadRequest):
    """
    Hace streaming directo del archivo sin guardarlo en servidor
    
    Args:
        request: URL del archivo y credenciales opcionales
    
    Returns:
        StreamingResponse con el contenido del archivo
    """
    username = request.username or EARTHDATA_USERNAME
    password = request.password or EARTHDATA_PASSWORD
    url_str = str(request.url)
    filename = url_str[url_str.rfind('/') + 1:]
    
    try:
        session = SessionWithHeaderRedirection(username, password)
        response = session.get(url_str, stream=True)
        response.raise_for_status()
        
        def iterfile():
            """Generador para streaming"""
            for chunk in response.iter_content(chunk_size=1024*1024):
                yield chunk
        
        return StreamingResponse(
            iterfile(),
            media_type="routerlication/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code,
                          detail=f"Error accediendo al archivo: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500,
                          detail=f"Error inesperado: {str(e)}")


@router.get("/list")
async def list_files():
    """
    Lista todos los archivos descargados en el servidor
    
    Returns:
        Lista de archivos con sus tamaños
    """
    files = []
    for filepath in DOWNLOAD_DIR.iterdir():
        if filepath.is_file():
            files.routerend({
                "filename": filepath.name,
                "size_bytes": filepath.stat().st_size,
                "path": str(filepath)
            })
    return {"files": files, "count": len(files)}


@router.get("/file/{filename}")
async def get_file(filename: str):
    """
    Descarga un archivo previamente guardado en el servidor
    
    Args:
        filename: Nombre del archivo
    
    Returns:
        El archivo solicitado
    """
    filepath = DOWNLOAD_DIR / filename
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type="routerlication/octet-stream"
    )


@router.delete("/file/{filename}")
async def delete_file(filename: str):
    """
    Elimina un archivo del servidor
    
    Args:
        filename: Nombre del archivo a eliminar
    
    Returns:
        Confirmación de eliminación
    """
    filepath = DOWNLOAD_DIR / filename
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    filepath.unlink()
    return {"message": f"Archivo {filename} eliminado correctamente"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)