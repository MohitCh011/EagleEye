const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
// Import Profile Routes
const profileRoutes = require("./routes/profileRoutes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // Authentication Routes
app.use("/api/projects", require("./routes/projectRoutes")); // Project Routes
app.use("/api/phases", require("./routes/phaseRoutes")); // Phase Routes
app.use("/api/admin", require("./routes/adminRoutes")); // Admin Routes
app.use("/api/inspector", require("./routes/inspectorRoutes")); // Inspector Routes
app.use("/api/map", require("./routes/mapRoutes")); // Map Routes
app.use("/api/contact-us", require("./routes/contactusRoutes")); // Contact Us Routes
app.use("/api/it-admin", require("./routes/ItAdminRoutes")); // Contact Us Routes
// Profile Routes
app.use("/api/profile", profileRoutes);
// server.js
app.use("/api/contractor", require("./routes/contractorRoutes"));

// Global error handling middleware
const errorMiddleware = require("./middlewares/errorMiddleware");
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
