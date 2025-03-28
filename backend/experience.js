const mongoose=require('mongoose')
mongoose.connect(`mongodb://localhost:27017/proffolio`)
const express = require("express");
const multer=require('multer')
const path = require("path");

const app=express()
const cors=require('cors')
app.use(cors())
const expSchema=new mongoose.Schema({
    name:String,
    institute:String,
    topic:String,
    image:String
})
app.use("/uploads", express.static("uploads"));

const Experience=mongoose.model('Experience',expSchema)
app.use(express.json())
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all experiences
app.get("/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new Experience
app.post("/experiences", upload.single("image"), async (req, res) => {
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
app.delete("/experiences/delete/:name", async (req, res) => {
  try {
    await Experience.findOneAndDelete({name:req.params.name});
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/experiences/update/:name", upload.single("image"), async (req, res) => {
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
app.get("/experiences/:name", async (req, res) => {
  try {
    const experiences = await Experience.findOne({name:req.params.name});
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(7000)
