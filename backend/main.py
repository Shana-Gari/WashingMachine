from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routes import admin, simulation

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

import os

origins_str = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(simulation.router)

@app.get("/")
def read_root():
    return {"message": "Washing Machine Fuzzy Logic Backend is running"}
