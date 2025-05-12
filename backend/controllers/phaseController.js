const Phase = require("../models/Phase");
const Project = require("../models/Project");
const { uploadImageToCloudinary, uploadVideoToCloudinary, uploadSrtToCloudinary } = require("../utils/cloudinaryUploader");
const { extractImageMetadata, extractVideoMetadata } = require("../utils/metadataExtractor");
const fs = require("fs");
const path = require("path");
const runMLModel = require("../utils/runMLModel")

// Helper function to parse SRT data for geolocation (latitude, longitude)
const extractGeolocationFromSrt = (srtContent) => {
  const geoData = [];
  const srtLines = srtContent.split('\n');

  for (let i = 0; i < srtLines.length; i++) {
    const line = srtLines[i];
    const latMatch = line.match(/latitude:\s*([\d.-]+)/);
    const lonMatch = line.match(/longitude:\s*([\d.-]+)/);

    if (latMatch && lonMatch) {
      geoData.push({
        latitude: parseFloat(latMatch[1]),
        longitude: parseFloat(lonMatch[1]),
      });
    }
  }

  return geoData;
};

// Function to compare geolocation data (continuity check)
const checkGeolocationContinuity = (previousGeoData, currentGeoData) => {
  const prevFrame = previousGeoData[previousGeoData.length - 1];
  const currFrame = currentGeoData[0];

  if (!prevFrame || !currFrame) {
    throw new Error("Invalid geolocation data for comparison");
  }

  const latDiff = Math.abs(prevFrame.latitude - currFrame.latitude);
  const lonDiff = Math.abs(prevFrame.longitude - currFrame.longitude);

  // Define threshold for continuity (this can be adjusted based on requirements)
  const threshold = 0.001; // 0.001 degrees, approximately 111 meters

  if (latDiff > threshold || lonDiff > threshold) {
    return false;
  }
  return true;
};

const createPhase = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Validate project access
    const project = await Project.findById(projectId).populate("phases");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Ensure the logged-in user is an assigned inspector
    if (!project.assignedInspectors.some((inspectorId) => inspectorId.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const file = req.file;
    const fileType = file.mimetype.split("/")[0];
    let uploadedFileUrl;
    let videoMetadata = {};
    let srtFileUrl;
    let previousGeoData = [];

    // Handle file upload and metadata extraction
    try {
      if (fileType === "image") {
        const imageMetadata = await extractImageMetadata(file.path);

        // Validate image metadata
        if (!imageMetadata || Object.keys(imageMetadata).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Image metadata is missing. Please ensure the image contains proper metadata.",
          });
        }

        uploadedFileUrl = await uploadImageToCloudinary(file.path, "phases");
      } else if (fileType === "video") {
        uploadedFileUrl = await uploadVideoToCloudinary(file.path, "phases");

        // Ensure .srt file exists and upload
        const srtFile = req.files?.srt;
        if (!srtFile) {
          return res.status(400).json({
            success: false,
            message: "Missing .srt file for video. Please upload a SRT file.",
          });
        }

        const srtContent = fs.readFileSync(srtFile[0].path, "utf-8");
        const currentGeoData = extractGeolocationFromSrt(srtContent);

        // Validate SRT data continuity
        if (project.phases.length > 0) {
          const lastPhase = project.phases[project.phases.length - 1];
          const previousSrtFile = lastPhase.srtFileUrl;
          const previousSrtContent = fs.readFileSync(path.join("uploads", previousSrtFile), "utf-8");
          previousGeoData = extractGeolocationFromSrt(previousSrtContent);

          const isContinuous = checkGeolocationContinuity(previousGeoData, currentGeoData);
          if (!isContinuous) {
            return res.status(400).json({
              success: false,
              message: "The uploaded video is not continuous with the previous video. Please ensure proper sequence.",
            });
          }
        }

        srtFileUrl = await uploadSrtToCloudinary(srtFile[0].path);
        videoMetadata = await extractVideoMetadata(file.path);

        // Ensure valid metadata exists
        if (!videoMetadata.latitude || !videoMetadata.longitude || !videoMetadata.timestamp) {
          return res.status(400).json({
            success: false,
            message: "Invalid video: Missing required metadata. Please ensure your video contains proper location and timestamp information.",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error processing media file. Please ensure it's a valid image or video with proper metadata.",
      });
    }

    // Run ML analysis (same as before)
    let mlAnalysis;
    const existingPhases = project.phases;
    
    if (existingPhases.length > 0) {
      const lastPhase = existingPhases[existingPhases.length - 1];
      
      const analysisData = {
        previousImageUrl: lastPhase.imageUrl ,
        currentImageUrl: uploadedFileUrl,
        previousProgress: lastPhase.progress,
      };
      mlAnalysis = await runMLModel("comparison", analysisData);
    } else {
      mlAnalysis = await runMLModel("analysis", uploadedFileUrl);
    }

    // Create new phase
    const newPhase = new Phase({
      project: projectId,
      imageUrl: fileType === "image" ? uploadedFileUrl : undefined,
      analysisResults: mlAnalysis,
      progress: mlAnalysis.progress,
    });

    await newPhase.save();

    // Update project with the new phase
    project.phases.push(newPhase._id);
    await project.save();

    res.status(200).json({
      success: true,
      message: "Phase created successfully",
      data: {
        phase: newPhase,
        analysisResults: mlAnalysis,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createPhase };
