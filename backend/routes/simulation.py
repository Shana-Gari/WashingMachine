from fastapi import APIRouter
from .. import schemas, fuzzy_logic

router = APIRouter(
    prefix="/simulation",
    tags=["simulation"],
)

@router.post("/", response_model=schemas.SimulationOutput)
def simulate_wash(input_data: schemas.SimulationInput):
    result = fuzzy_logic.calculate_fuzzy_values(
        input_data.total_load,
        input_data.avg_dirt_level,
        input_data.max_delicateness
    )
    return result
