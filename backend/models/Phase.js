const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema(
    {
        // title: { type: String, required: true },
        // activityType: { type: String, required: true },
        imageUrl: { type: String },  // Image URL (Cloudinary)
        
        progress: { type: Number, default: 0 },
        analysisResults: { type: Object },
        comparisonResults: { type: Object },  
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Phase", phaseSchema);
