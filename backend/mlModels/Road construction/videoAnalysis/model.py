import cv2
import torch
import json
import os
from ultralytics import YOLO

def process_video(video_path):
    # Load the YOLOv8 model (replace with your custom-trained model path)
    model = YOLO(r'C:\Users\91888\Downloads\sihFinal11\backend\mlModels\Road construction\videoAnalysis\best (1).pt')

    # Prepare the report structure
    report = {"video_path": video_path, "frames": []}

    # Open the video file (either from URL or file path)
    cap = cv2.VideoCapture(video_path)

    # Check if video was successfully opened
    if not cap.isOpened():
        return {"error": "Error opening video stream or file"}

    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Process the video
    frame_number = 0
    frame_interval = int(fps * 2)  # Capture a frame every 2 seconds

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Process every 2 seconds (frame interval)
        if frame_number % frame_interval == 0:
            # Run YOLOv8 inference
            results = model(frame)

            # Initialize a list to store detection results for the current frame
            frame_report = {"frame_number": frame_number, "detections": []}

            # Extract bounding boxes and classes from results
            boxes = results[0].boxes  # Extract boxes from the first batch of results
            for box in boxes:
                conf = box.conf[0].item()  # Confidence score
                cls = int(box.cls[0].item())  # Class index
                x1, y1, x2, y2 = map(int, box.xywh[0])  # Bounding box coordinates

                # Only consider boxes with a confidence score above 0.4
                if conf > 0.4:
                    label = model.names[cls]
                    # Store the detection data in the frame report
                    frame_report["detections"].append({
                        "label": label,
                        "confidence": conf,
                        "coordinates": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                    })

            # Add the frame report to the overall report
            report["frames"].append(frame_report)

        frame_number += 1

    # Release video objects
    cap.release()

    # Return the generated report as a JSON
    return report

def main():
    # Get the video input from the command line argument (or URL)
    video_path = input("Enter video file path or URL: ")

    # Process the video and generate the report
    video_analysis_report = process_video(video_path)

    # Output the report as a JSON string
    print(json.dumps(video_analysis_report, indent=4))

if __name__ == "__main__":
    main()
