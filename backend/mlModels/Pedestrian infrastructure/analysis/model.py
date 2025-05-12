import sys
import json
import os
import requests
from ultralytics import YOLO
from collections import Counter, defaultdict
from PIL import Image
from io import BytesIO
import contextlib
import io

# YOLO Model paths
PEDESTRIAN_MODEL_PATH = r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\analysis\best (4).pt"
PHASE_MODELS_PATHS = [r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\analysis\best (2).pt", r"C:\Users\91888\Downloads\sihFinal10\backend\mlModels\Pedestrian infrastructure\analysis\road1.pt"]

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
    """Download image from URL and save locally."""
    try:
        response = requests.get(image_url)
        response.raise_for_status()

        # Get content type and determine extension
        content_type = response.headers.get("Content-Type", "")
        if not content_type or "image" not in content_type:
            raise ValueError("The provided URL does not point to an image.")

        extension = content_type.split("/")[-1]
        if extension not in ["jpeg", "jpg", "png", "gif"]:
            raise ValueError(f"Unsupported image format: {extension}")

        # Save the image locally
        image = Image.open(BytesIO(response.content))
        local_path = f"temp_image.{extension}"
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
    """Run detection using a YOLO model and return detected classes."""
    try:
        detected_classes = defaultdict(list)
        results = model.predict(source=image_path, conf=conf_threshold, save=False)
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                detected_classes[class_name].append(confidence)
        return detected_classes
    except Exception as e:
        return {"error": f"Error during detection: {str(e)}"}

@suppress_logs
def analyze_image(image_path):
    """Perform image analysis with detection logic."""
    try:
        phase_3_detected = False

        # Check for "phase-3-completed" using phase models
        for phase_model in phase_models:
            detected_classes = detect_classes(image_path, phase_model)
            if "phase-3-completed" in detected_classes or "phase-3 completed" in detected_classes:
                phase_3_detected = True
                break

        if phase_3_detected:
            pedestrian_classes = detect_classes(image_path, pedestrian_model)
            if len(pedestrian_classes) == 1 and (
                "phase-3-completed" in pedestrian_classes or "phase-3 completed" in pedestrian_classes
            ):
                return {"progress": 100, "stage": "Phase 3 Completed, No Pedestrian Installed"}
            else:
                class_counts = Counter(pedestrian_classes.keys())
                return {
                    "progress": 100,
                    "stage": "Phase 3 Completed with Pedestrian Classes Detected",
                    "detected_classes": dict(class_counts),
                }
        else:
            return {"progress": 0, "stage": "Phase 3 Not Detected"}

    except Exception as e:
        return {"error": f"Error during analysis: {str(e)}"}

if __name__ == "__main__":
    try:
        # Input validation
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No image URL or path provided"}))
            sys.exit(1)

        image_input = sys.argv[1]
        if image_input.startswith("http://") or image_input.startswith("https://"):
            image_path = download_image(image_input)
        elif os.path.exists(image_input):
            image_path = image_input
        else:
            print(json.dumps({"error": f"Invalid image input: {image_input}"}))
            sys.exit(1)

        # Analyze image
        result = analyze_image(image_path)
        print(json.dumps(result))

        # Cleanup
        if image_path.startswith("temp_image"):
            os.remove(image_path)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
