from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Cloth(Base):
    __tablename__ = "clothes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String)  # We might store base64 or just a path/url
    weight = Column(Float) # Numeric value
    dirt_level = Column(Float) # 1-10 scale
    delicateness = Column(Float) # 1-10 scale
