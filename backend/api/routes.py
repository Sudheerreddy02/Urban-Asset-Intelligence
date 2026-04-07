from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import cv2
from services.model import yolo_service
from services.image_processor import tile_image

router = APIRouter()

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    temp_path = os.path.join(TEMP_DIR, file.filename)
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"filename": file.filename, "status": "Uploaded successfully.", "temp_path": temp_path}

@router.post("/analyze")
async def analyze_image(payload: dict):
    image_path = payload.get("image_path")
    if not image_path or not os.path.exists(image_path):
        raise HTTPException(status_code=400, detail="Invalid image path.")
        
    # Tile image (or resize)
    tiles = tile_image(image_path)
    if not tiles:
        raise HTTPException(status_code=500, detail="Failed to process image.")
        
    # Run YOLO segmentation on the first tile for MVP
    result = yolo_service.run_inference(tiles[0])
    
    return result

@router.get("/health")
async def get_health():
    return {"status": "Backend Operations Online"}
