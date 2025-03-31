const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();

// Connect to MongoDB using environment variable
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if unable to connect
  }
};

connectDB(); // Call the function to connect

// Enable CORS with high payload limit
app.use(cors({ limit: "100mb" }));

// Middleware for JSON and URL-encoded data
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import route handlers
const achievementsRoutes = require("./achievements");
const blogRoutes = require("./blog");
const collaborationsRoutes = require("./collaborations");
const conferencesRoutes = require("./conferences");
const experienceRoutes = require("./experience");
const projectsRoutes = require("./projects");
const researchRoutes = require("./research");

// Use route handlers
app.use("/", achievementsRoutes);
app.use("/", blogRoutes);
app.use("/", collaborationsRoutes);
app.use("/", conferencesRoutes);
app.use("/", experienceRoutes);
app.use("/", projectsRoutes);
app.use("/", researchRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

