const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Admin", "Inspector", "Contractor", "IT Admin"], required: true },
        profileImage: { type: String, default: "" },
        assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
        isFirstLogin: { type: Boolean, default: true },
        contactNumber: { type: Number },
        createdUsersCount:{type:Number},
        createdPhasesCount:{type:Number},
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
