from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.post("/clothes/", response_model=schemas.Cloth)
def create_cloth(cloth: schemas.ClothCreate, db: Session = Depends(database.get_db)):
    db_cloth = models.Cloth(**cloth.model_dump())
    db.add(db_cloth)
    db.commit()
    db.refresh(db_cloth)
    return db_cloth

@router.get("/clothes/", response_model=List[schemas.Cloth])
def read_clothes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    clothes = db.query(models.Cloth).offset(skip).limit(limit).all()
    return clothes
