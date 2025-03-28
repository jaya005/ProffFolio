const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/proffolio")
// Enable CORS with high payload limit
app.use(cors({ limit: "100mb" }));

// Middleware for JSON and URL-encoded data
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mongoose Schema
const achievementSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});
const Achievement = mongoose.model("achievement", achievementSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Multer Upload Middleware with File Size Limit
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

// ✅ GET all achievements
app.get("/achievements", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST a new achievement (with image upload)
app.post("/achievements", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newAchievement = new Achievement({ name, description, image });
    await newAchievement.save();

    res.status(201).json(newAchievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE an achievement by ID
app.get("/achievements/:name", async (req, res) => {
  try {
    const achievements = await Achievement.findOne({name:req.params.name});
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/achievements/delete/:name", async (req, res) => {
  try {
    const achievement = await Achievement.findOneAndDelete({name:req.params.name});
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // Delete image file if exists
    if (achievement.image) {
      fs.unlinkSync(`./uploads/${achievement.image}`);
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE an achievement by ID
app.put("/achievements/update/:name", upload.single("image"), async (req, res) => {
  try {
    // Find the achievement
    const achievement = await Achievement.findOne({ name: req.params.name });
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // Prepare update data (retain existing fields if not provided)
    const updatedData = {
      name: req.body.name || achievement.name,
      description: req.body.description || achievement.description,
      image: req.file ? req.file.filename : achievement.image, // Keep old image if none uploaded
    };

    // Delete old image if a new one is uploaded
    if (req.file && achievement.image) {
      const oldImagePath = path.join(__dirname, "uploads", achievement.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the achievement
    const updatedAchievement = await Achievement.findOneAndUpdate(
      { name: req.params.name },
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/count/achievements", async (req, res) => {
  const count = await Achievement.countDocuments();
  res.json({ count });
});

// Start Server
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
