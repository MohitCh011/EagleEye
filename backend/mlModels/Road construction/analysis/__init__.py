from ultralytics import YOLO

# Load the YOLO model for this activity
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

def analyze_image(image_path):
    results = model.predict(source=image_path, conf=0.1)
    return results
