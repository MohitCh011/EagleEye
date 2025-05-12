import sys
import json
import os
import requests
from ultralytics import YOLO
from collections import Counter
from PIL import Image
from io import BytesIO

# Path to your models folder
model_folder = r"C:\Users\91888\Downloads\sihFinal11\backend\mlModels\Road construction\SIH_MODELS"

# List of model files (all the models you mentioned)
model_files = [
    "gas.pt", "utility.pt", "hiugh.pt", "line.pt", "manhole.pt", "patch.pt", 
    "pedestrian.pt", "road1.pt", "roadmedian.pt", "roadrepair.pt", 
    "sih(ws)-roads.pt", "best.pt", "best (1).pt", "best (2).pt"
]

# Load YOLO models dynamically from the specified folder
models = {}
for model_file in model_files:
    model_path = os.path.join(model_folder, model_file)
    if os.path.exists(model_path):
        try:
            models[model_file] = YOLO(model_path)
            print(f"Successfully loaded model: {model_file}")
        except Exception as e:
            print(f"Error loading {model_file}: {e}")
    else:
        print(f"Model file not found: {model_path}")

# Define different confidence and IoU thresholds for each model
thresholds = {
    "gas.pt": {"conf": 0.40, "iou": 0.5},
    "utility.pt": {"conf": 0.40, "iou": 0.4},
    "hiugh.pt": {"conf": 0.40, "iou": 0.6},
    "line.pt": {"conf": 0.40, "iou": 0.5},
    "manhole.pt": {"conf": 0.40, "iou": 0.7},
    "patch.pt": {"conf": 0.40, "iou": 0.5},
    "pedestrian.pt": {"conf": 0.40, "iou": 0.6},
    "road1.pt": {"conf": 0.40, "iou": 0.6},
    "roadmedian.pt": {"conf": 0.40, "iou": 0.5},
    "roadrepair.pt": {"conf": 0.40, "iou": 0.5},
    "sih(ws)-roads.pt": {"conf": 0.40, "iou": 0.5},
    "best.pt": {"conf": 0.40, "iou": 0.5},
    "best (1).pt": {"conf": 0.40, "iou": 0.5},
    "best (2).pt": {"conf": 0.40, "iou": 0.6},
}

# Predefined progress values for each phase
phase_progress = {
    "phase 1 in progress": 20,
    "phase 1 completed": 30,
    "phase 2 in progress": 50,
    "phase 2 completed": 70,
    "phase 3 in progress": 80,
    "phase 3 completed": 100,
    "phase-3 completed": 100,
    "phase-3-completed": 100,
    "phase-3 in progress": 80,
    "cc road": 90
}

# Helper Functions
def process_results(results, model):
    """Process YOLO results and return detected classes with confidence."""
    detected_classes = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls)
            confidence = float(box.conf[0])
            class_name = model.names[class_id]  # Get class name from model's 'names' attribute
            detected_classes.append((class_name, confidence))
    return detected_classes

def normalize_classes(detected_classes):
    """Normalize class names and count occurrences."""
    normalized_classes = Counter()
    for cls, _ in detected_classes:
        normalized_classes[cls] += 1  # We just count occurrences here
    return normalized_classes

# Function to download an image from a URL
def download_image(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        return img
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image: {e}")
        return None

# Compare progress difference between two sets of detected classes
def compare_progress(image_1_classes, image_2_classes):
    progress_diff = {}
    for cls in set(image_1_classes.keys()).union(image_2_classes.keys()):
        image_1_progress = phase_progress.get(cls, 0)
        image_2_progress = phase_progress.get(cls, 0)
        progress_diff[cls] = abs(image_1_progress - image_2_progress)
    return progress_diff

def analyze_image(image_input):
    """Perform image analysis using YOLO."""
    # Check if input is a URL or local path
    if image_input.startswith("http://") or image_input.startswith("https://"):
        image_1 = download_image(image_input)  # Download image from URL
        if image_1 is None:
            return {"error": "Error downloading the image"}
    else:
        if not os.path.exists(image_input):
            return {"error": f"The file does not exist: {image_input}"}
        image_1 = Image.open(image_input)
    
    # Detect classes using YOLO models for the image
    detected_classes_1 = {}

    for model_name, model in models.items():
        print(f"Running inference with model {model_name} for the image...")
        try:
            conf_threshold = thresholds[model_name]["conf"]
            iou_threshold = thresholds[model_name]["iou"]
            results_1 = model.predict(source=image_1, save=False, conf=conf_threshold, iou=iou_threshold)
            model_results_1 = process_results(results_1, model)
            for class_name, confidence in model_results_1:
                if class_name not in detected_classes_1:
                    detected_classes_1[class_name] = {"models": {model_name}, "confidences": [confidence], "bounding_boxes": [results_1[0].boxes]}
                else:
                    detected_classes_1[class_name]["models"].add(model_name)
                    detected_classes_1[class_name]["confidences"].append(confidence)
                    detected_classes_1[class_name]["bounding_boxes"].append(results_1[0].boxes)
        except Exception as e:
            print(f"Error during inference with {model_name} for the image: {e}")
    
    # Compare the progress differences between the image and itself (or another image)
    progress_diff = compare_progress(detected_classes_1, detected_classes_1)

    # Return the progress diff as JSON
    return json.dumps(progress_diff)

if __name__ == "__main__":
    try:
        # Ensure an image path or URL is provided
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No image URL or path provided"}))
            sys.exit(1)

        image_input = sys.argv[1]

        # Perform analysis
        analysis = analyze_image(image_input)

        # Print only the JSON result
        print(analysis)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
