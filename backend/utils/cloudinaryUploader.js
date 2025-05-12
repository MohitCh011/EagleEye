// cloudinaryUploader.js

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "image", // For image uploads
        });
        return result.secure_url;
    } catch (error) {
        throw new Error("Error uploading image: " + error.message);
    }
};

// Function to upload video to Cloudinary
const uploadVideoToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "video", // For video uploads
        });
        return result.secure_url;
    } catch (error) {
        throw new Error("Error uploading video: " + error.message);
    }
};

// Function to upload .srt subtitle files to Cloudinary
const uploadSrtToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw", // For non-image/video files
            folder: "phases/subtitles",
        });
        return result.secure_url;
    } catch (error) {
        throw new Error("Error uploading .srt file: " + error.message);
    }
};

module.exports = { uploadImageToCloudinary, uploadVideoToCloudinary, uploadSrtToCloudinary };
