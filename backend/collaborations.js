const mongoose=require('mongoose')
const express = require("express");
const multer=require('multer')
const path = require("path");
const router = express.Router();
const CollaborationSchema=new mongoose.Schema({
    name:String,
    institution:String,
    topic:String,
    image:String
})
const Collaboration=mongoose.model('Collaboration',CollaborationSchema)

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all Collaborations
router.get("/collaborations", async (req, res) => {
  try {
    const Collaborations = await Collaboration.find();
    res.json(Collaborations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new Collaboration
router.post("/collaborations", upload.single("image"),async (req, res) => {
  try {
    const { name, institution,topic} = req.body;
    const image = req.file ? req.file.filename : null;
    const newCollaboration = new Collaboration({name, institution,topic, image });
    await newCollaboration.save();
    res.status(201).json(newCollaboration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an Collaboration by ID
router.delete("/collaborations/delete/:name", async (req, res) => {
  try {
    await Collaboration.findOneAndDelete({name:req.params.name});
    res.json({ message: "Collaboration deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/collaborations/update/:name", upload.single("image"), async (req, res) => {
  try {
    const { name,image, institution,topic} = req.body;  
    const updatedCollaborationData = {
        name, institution,topic,image
    };

    // If a new image is uploaded, update it
    if (req.file) {
      updatedCollaborationData.image = req.file.filename;
    }

    const updatedCollaboration = await Collaboration.findOneAndUpdate(
      req.params.id,
      updatedCollaborationData,
      { new: true, runValidators: true }
    );

    if (!updatedCollaboration) {
      return res.status(404).json({ error: "Collaboration not found" });
    }

    res.json(updatedCollaboration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/count/collaborations", async (req, res) => {
  const count = await Collaboration.countDocuments();
  res.json({ count });
});
router.get("/collaborations/:name", async (req, res) => {
  try {
    const collaborations = await Collaboration.findOne({name:req.params.name});
    res.json(collaborations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports=router