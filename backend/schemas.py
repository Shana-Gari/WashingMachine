from pydantic import BaseModel
from typing import List, Optional

class ClothBase(BaseModel):
    name: str
    image_url: str
    weight: float
    dirt_level: float
    delicateness: float

class ClothCreate(ClothBase):
    pass

class Cloth(ClothBase):
    id: int

    class Config:
        from_attributes = True

class SimulationInput(BaseModel):
    total_load: float
    avg_dirt_level: float
    max_delicateness: float

class SimulationOutput(BaseModel):
    wash_time: float
    water_level: float
    spin_speed: float
    detergent_amount: float
    explanation: Optional[str] = None
