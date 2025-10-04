import os
from dotenv import load_dotenv
from alembic import context

load_dotenv()

USER_DB = os.getenv("USER_DB")
PASSWORD_DB = os.getenv("PASSWORD_DB")
HOST_DB = os.getenv("HOST_DB")
PORT_DB = os.getenv("PORT_DB")
NAME_DB = os.getenv("NAME_DB")

DATABASE_URL = f"postgresql+psycopg2://{USER_DB}:{PASSWORD_DB}@{HOST_DB}:{PORT_DB}/{NAME_DB}"

SECRET_KEY = os.getenv("SECRET_KEY", "clave-secreta")