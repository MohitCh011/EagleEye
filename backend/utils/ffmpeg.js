const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const extractVideoMetadata = async (filePath) => {
    try {
        const metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, data) => {
                if (err) reject("Error extracting video metadata: " + err.message);
                resolve(data);
            });
        });

        const { latitude, longitude, timestamp, orientation } = metadata.format.tags || {};

        if (!latitude || !longitude || !timestamp) {
            throw new Error('Missing essential metadata (latitude, longitude, timestamp) in video.');
        }

        return { latitude, longitude, timestamp: new Date(timestamp), orientation };
    } catch (err) {
        throw new Error("Error extracting video metadata: " + err.message);
    }
};

module.exports = { extractVideoMetadata };
