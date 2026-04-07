import cv2
import numpy as np

def tile_image(image_path: str, tile_size: int = 1024, overlap: int = 0):
    """
    Splits a large image into smaller tiles.
    For MVP, we resize large images to fit in memory
    """
    image = cv2.imread(image_path)
    if image is None:
        return []
    
    h, w = image.shape[:2]
    
    # Resize to max 1024 on the longest edge if too large
    max_dim = max(h, w)
    if max_dim > tile_size:
        scale = tile_size / max_dim
        image = cv2.resize(image, (int(w * scale), int(h * scale)))
        
    return [image]

def stitch_masks(masks, original_shape):
    """
    Stitches mask tiles back together.
    """
    if not masks:
        return np.zeros(original_shape, dtype=np.uint8)
    return masks[0]
