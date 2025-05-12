import sys
import json
import os
import requests
from ultralytics import YOLO
from difflib import SequenceMatcher
from collections import defaultdict
from PIL import Image
from io import BytesIO
import contextlib
import io

# Load YOLO models with configuration
model_configs = [
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\hiugh.pt", "conf": 0.15, "iou": 0.5},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\line.pt", "conf": 0.1, "iou": 0.9},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\best (1).pt", "conf": 0.2, "iou": 0.4},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\road1.pt", "conf": 0.2, "iou": 0.4},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\drone road gowtham.pt", "conf": 0.2, "iou": 0.4},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\best.pt", "conf": 0.1, "iou": 0.45},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\best (4).pt", "conf": 0.1, "iou": 0.45},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\sih(ws)-roads.pt", "conf": 0.1, "iou": 0.45},
    {"path": r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Phase Identification\analysis\road phases gowtham.pt", "conf": 0.25, "iou": 0.5},
]

# Global confidence threshold
global_conf_threshold = 0.18

# Load YOLO models and check paths
try:
    models = []
    thresholds = []
    for config in model_configs:
        if not os.path.exists(config["path"]):
            print(json.dumps({"error": f"Model not found: {config['path']}"}))
            sys.exit(1)
        model = YOLO(config["path"], verbose=False)
        models.append(model)
        thresholds.append({"conf": config["conf"], "iou": config["iou"]})
except Exception as e:
    print(json.dumps({"error": f"Error loading models: {str(e)}"}))
    sys.exit(1)

def download_image(image_url):
    """Download an image from a URL and save it locally."""
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        content_type = response.headers.get('Content-Type')
        if 'image' not in content_type:
            raise ValueError("Provided URL is not an image.")

        extension = content_type.split('/')[-1]
        if extension not in ['jpeg', 'jpg', 'png']:
            raise ValueError(f"Unsupported image format: {extension}")

        local_path = f"temp_image.{extension}"
        Image.open(BytesIO(response.content)).save(local_path)
        return local_path
    except Exception as e:
        return {"error": f"Error downloading image: {str(e)}"}

def suppress_logs(func):
    """Decorator to suppress logs."""
    def wrapper(*args, **kwargs):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return func(*args, **kwargs)
    return wrapper

@suppress_logs
def detect_classes(image_path, models, thresholds):
    """Detect classes using multiple YOLO models."""
    detected_classes = defaultdict(list)
    for i, (model, threshold) in enumerate(zip(models, thresholds)):
        results = model.predict(source=image_path, conf=threshold["conf"], iou=threshold["iou"])
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                if confidence >= global_conf_threshold:
                    detected_classes[class_name].append(confidence)
    return detected_classes

def merge_similar_classes(class_names):
    """Merge similar classes based on name similarity."""
    unique_classes = []
    for class_name in class_names:
        if not any(SequenceMatcher(None, class_name, unique).ratio() > 0.85 for unique in unique_classes):
            unique_classes.append(class_name)
    return unique_classes

def calculate_progress(classes):
    """Calculate progress based on detected classes."""
    progress_mapping = {
        "phase 1 in progress": 20,
        "phase 1 completed": 30,
        "phase 2 in progress": 50,
        "phase 2 completed": 70,
        "phase 3 in progress": 90,
        "phase 3 completed": 100,
        "phase-3 completed": 100,
    }
    return max(progress_mapping.get(cls, 0) for cls in classes)

if __name__ == "__main__":
    try:
        # Validate input
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Image URL or path is required."}))
            sys.exit(1)

        image_input = sys.argv[1]
        image_path = download_image(image_input) if image_input.startswith("http") else image_input
        if not os.path.exists(image_path):
            print(json.dumps({"error": f"File not found: {image_input}"}))
            sys.exit(1)

        # Analyze image
        detected_classes = detect_classes(image_path, models, thresholds)
        unique_classes = merge_similar_classes(detected_classes.keys())
        phase_classes = [cls for cls in unique_classes if "phase" in cls]
        progress = calculate_progress(phase_classes)

        # Build output
        output = {
            "progress": progress,
            "unique_classes": unique_classes,
            "phase_classes": phase_classes,
            "detailed_classes": {
                cls: {
                    "count": len(detected_classes[cls]),
                    "avg_confidence": sum(detected_classes[cls]) / len(detected_classes[cls]),
                }
                for cls in unique_classes
            },
        }

        # Print JSON output
        print(json.dumps(output))

        # Cleanup temporary file
        if image_path.startswith("temp_image"):
            os.remove(image_path)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
