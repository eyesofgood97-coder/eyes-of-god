from core.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Astro(Base):
    __tablename__ = "astro"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(30), nullable=False)