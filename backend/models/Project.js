// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        startCoordinates: { lat: Number, lng: Number },
        endCoordinates: { lat: Number, lng: Number },
        
        tempPhaseData: {
            type: Object,
            default: null,  // Initially, no phase data stored
        },
        assignedContractor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedInspectors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        phases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phase" }],
        progress: { type: Number, default: 0 },
        status: { type: String, enum: ["Under Construction", "Completed"], default: "Under Construction" },
        transferHistory: [
            {
                from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);




