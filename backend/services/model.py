import os
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from core.config import settings

class YoloModel:
    def __init__(self):
        self.model = None
        
    def load_model(self):
        os.makedirs(settings.WEIGHTS_DIR, exist_ok=True)
        # Load standard yolov8n-seg model for the makeathon MVP demonstration
        try:
            # If the weights path doesn't exist, YOLO will download standard coco base implicitly
            self.model = YOLO(settings.MODEL_WEIGHTS_PATH if os.path.exists(settings.MODEL_WEIGHTS_PATH) else "yolov8n-seg.pt")
            print("YOLOv8 Model loaded successfully.")
        except Exception as e:
            print(f"Error loading YOLO model: {e}")

    def run_inference(self, image: np.ndarray):
        if self.model is None:
            self.load_model()
            
        results = self.model(image)[0]
        
        # Calculate generic area mapping for demonstration
        # Map some standard COCO classes to urban assets just for MVP analytics
        analytics = {"Buildings": 0, "Vegetation": 0, "Roads": 0, "Water": 0}
        
        annotated_img = results.plot()
        
        # Encode as base64 for frontend display
        _, buffer = cv2.imencode('.jpg', annotated_img)
        img_str = base64.b64encode(buffer).decode('utf-8')
        
        if results.masks is not None:
            num_masks = len(results.masks.data)
            # Mock spatial metrics calculating real world area vs masks
            analytics["Buildings"] = num_masks * 1050 + 500  # squ m
            analytics["Vegetation"] = num_masks * 3000 + 1200
            analytics["Roads"] = num_masks * 1250
            analytics["Water"] = max(0, (num_masks-2) * 5000)
        
        return {
            "image_base64": f"data:image/jpeg;base64,{img_str}",
            "analytics": analytics
        }

yolo_service = YoloModel()
