const mongoose=require('mongoose')
const express = require("express");
const multer=require('multer')
const path = require("path");
const router = express.Router();

const expSchema=new mongoose.Schema({
    name:String,
    institute:String,
    topic:String,
    image:String
})
router.use("/uploads", express.static("uploads"));

const Experience=mongoose.model('Experience',expSchema)
router.use(express.json())
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all experiences
router.get("/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new Experience
router.post("/experiences", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body); // Debugging: Check what is actually received in req.body

    const { name, institute, topic } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !institute || !topic) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newExperience = new Experience({ name, institute, topic, image });
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// DELETE an Experience by ID
router.delete("/experiences/delete/:name", async (req, res) => {
  try {
    await Experience.findOneAndDelete({name:req.params.name});
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/experiences/update/:name", upload.single("image"), async (req, res) => {
  try {
    const { name,institute,topic,image} = req.body;  
    const updatedExperienceData = {
        name,institute,topic,image
    };

    // If a new image is uploaded, update it
    if (req.file) {
      updatedExperienceData.image = req.file.filename;
    }

    const updatedExperience = await Experience.findOneAndUpdate(
      req.params.id,
      updatedExperienceData,
      { new: true, runValidators: true }
    );

    if (!updatedExperience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/experiences/:name", async (req, res) => {
  try {
    const experiences = await Experience.findOne({name:req.params.name});
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports=router