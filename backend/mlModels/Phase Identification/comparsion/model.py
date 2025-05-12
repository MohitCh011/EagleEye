import os
import requests
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from collections import Counter, defaultdict
import json
import contextlib
import io
import sys

# Paths to YOLO models
PEDESTRIAN_MODEL_PATH = r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\comparsion\best (4).pt"
PHASE_MODELS_PATHS = [
    r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\comparsion\best (2).pt",
    r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\comparsion\road1.pt"
]

# Load YOLO models
try:
    pedestrian_model = YOLO(PEDESTRIAN_MODEL_PATH, verbose=False)
    phase_models = [YOLO(path, verbose=False) for path in PHASE_MODELS_PATHS if os.path.exists(path)]
    if len(phase_models) != len(PHASE_MODELS_PATHS):
        raise FileNotFoundError("Some phase detection models are missing. Check the paths.")
except Exception as e:
    print(json.dumps({"error": f"Error loading models: {str(e)}"}))
    sys.exit(1)

def download_image(image_url):
    """Download an image from a URL and save locally."""
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        content_type = response.headers.get('Content-Type', '')
        if 'image' not in content_type:
            raise ValueError("The provided URL does not point to an image.")

        extension = content_type.split('/')[-1]
        if extension not in ['jpeg', 'jpg', 'png']:
            raise ValueError(f"Unsupported image format: {extension}")

        temp_dir = "./temp_images"
        os.makedirs(temp_dir, exist_ok=True)
        local_path = os.path.join(temp_dir, f"temp_image.{extension}")
        image = Image.open(BytesIO(response.content))
        image.save(local_path)
        return local_path
    except Exception as e:
        print(json.dumps({"error": f"Error downloading image: {str(e)}"}))
        sys.exit(1)

def suppress_logs(func):
    """Decorator to suppress logs."""
    def wrapper(*args, **kwargs):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return func(*args, **kwargs)
    return wrapper

@suppress_logs
def detect_classes(image_path, model, conf_threshold=0.18):
    """Detect classes in an image using a YOLO model."""
    detected_classes = defaultdict(list)
    try:
        results = model.predict(source=image_path, conf=conf_threshold, save=False)
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                detected_classes[class_name].append(confidence)
    except Exception as e:
        print(json.dumps({"error": f"Error during detection: {str(e)}"}))
    return detected_classes

def compare_images(image1_path, image2_path):
    """Compare two images and analyze progress."""
    try:
        # Analyze Image 1
        image1_classes = {}
        for model in phase_models + [pedestrian_model]:
            image1_classes.update(detect_classes(image1_path, model))

        # Analyze Image 2
        image2_classes = {}
        for model in phase_models + [pedestrian_model]:
            image2_classes.update(detect_classes(image2_path, model))

        # Determine if phase-3 is detected
        phase_3_image1 = "phase-3-completed" in image1_classes or "phase-3 completed" in image1_classes
        phase_3_image2 = "phase-3-completed" in image2_classes or "phase-3 completed" in image2_classes

        # Determine progress
        if phase_3_image1 and phase_3_image2:
            progress = 100
            description = "Phase 3 detected in both images."
        elif phase_3_image1:
            progress = 50
            description = "Phase 3 detected in Image 1 but not in Image 2."
        elif phase_3_image2:
            progress = 50
            description = "Phase 3 detected in Image 2 but not in Image 1."
        else:
            progress = 0
            description = "Phase 3 not detected in either image."

        # Cleanup downloaded images
        if os.path.exists(image1_path) and image1_path.startswith("./temp_images"):
            os.remove(image1_path)
        if os.path.exists(image2_path) and image2_path.startswith("./temp_images"):
            os.remove(image2_path)

        # Output result in JSON format
        return {
            "progress": progress,
            "description": description,
            "image1_classes": dict(Counter(image1_classes)),
            "image2_classes": dict(Counter(image2_classes))
        }
    except Exception as e:
        return {"error": f"Error comparing images: {str(e)}"}

if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Two image URLs or paths are required for comparison."}))
            sys.exit(1)

        # Input paths or URLs
        image1_input = sys.argv[1]
        image2_input = sys.argv[2]

        image1_path = download_image(image1_input) if image1_input.startswith("http") else image1_input
        image2_path = download_image(image2_input) if image2_input.startswith("http") else image2_input

        if not os.path.exists(image1_path) or not os.path.exists(image2_path):
            print(json.dumps({"error": "Invalid image paths provided."}))
            sys.exit(1)

        # Compare images
        result = compare_images(image1_path, image2_path)

        # Print JSON result
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
