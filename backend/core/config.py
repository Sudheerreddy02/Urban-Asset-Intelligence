import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Urban Asset Intelligence"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # Path to weights relative to the backend directory
    WEIGHTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "weights")
    MODEL_WEIGHTS_PATH: str = os.path.join(WEIGHTS_DIR, "best.pt")
    
    class Config:
        case_sensitive = True

settings = Settings()
