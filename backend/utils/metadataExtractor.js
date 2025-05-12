const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Function to extract image metadata
const extractImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    // Extract EXIF data for GPS coordinates, timestamp, etc.
    const imageMetadata = {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      exif: metadata.exif,
    };

    if (metadata.exif) {
      // Parse EXIF data (for latitude, longitude, timestamp)
      const exifData = parseExif(metadata.exif);
      imageMetadata.latitude = exifData.latitude;
      imageMetadata.longitude = exifData.longitude;
      imageMetadata.timestamp = exifData.timestamp;
    }

    return imageMetadata;
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    throw new Error('Unable to extract image metadata');
  }
};

// Helper function to parse EXIF data
const parseExif = (exifDataBuffer) => {
  // Example EXIF parsing (you can use a library like exif-js or exiftool for more advanced parsing)
  const exifData = exifDataBuffer.toString('utf8');
  const latitudeMatch = exifData.match(/Latitude\s*:\s*(\d+\.\d+)/);
  const longitudeMatch = exifData.match(/Longitude\s*:\s*(\d+\.\d+)/);
  const timestampMatch = exifData.match(/DateTimeOriginal\s*:\s*(\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2})/);

  return {
    latitude: latitudeMatch ? latitudeMatch[1] : null,
    longitude: longitudeMatch ? longitudeMatch[1] : null,
    timestamp: timestampMatch ? timestampMatch[1] : null,
  };
};

// Function to extract video metadata
const extractVideoMetadata = async (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject('Error extracting video metadata');
      }

      // Extract video duration, geolocation (latitude, longitude), and timestamp
      const videoMetadata = {
        duration: metadata.format.duration,
        latitude: null,
        longitude: null,
        timestamp: null,
      };

      // Example: Extract latitude, longitude, and timestamp from metadata (if available)
      if (metadata.streams && metadata.streams[0].tags) {
        videoMetadata.latitude = metadata.streams[0].tags.latitude || null;
        videoMetadata.longitude = metadata.streams[0].tags.longitude || null;
        videoMetadata.timestamp = metadata.format.start_time || null;
      }

      resolve(videoMetadata);
    });
  });
};

module.exports = { extractImageMetadata, extractVideoMetadata };
