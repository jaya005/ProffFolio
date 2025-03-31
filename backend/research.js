const mongoose=require('mongoose')
const express = require("express");
const multer=require('multer')
const path = require("path");
const router = express.Router();
// router.use("/uploads", express.static("uploads"));

const Paperschema=new mongoose.Schema({
    title:String,
    description:String,
    category:String,
    image:String
})
const Paper=mongoose.model('Paper',Paperschema)
router.use(express.json())
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all Papers
router.get("/Papers", async (req, res) => {
  try {
    const Papers = await Paper.find();
    res.json(Papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new Paper
router.post("/Papers", upload.single("image"),async (req, res) => {
  try {
    const { title,description,category} = req.body;
    const image = req.file ? req.file.filename : null;
    const newPaper = new Paper({title,description,category,image });
    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an Paper by ID
router.delete("/Papers/delete/:name", async (req, res) => {
  try {
    await Paper.findOneAndDelete({name:req.params.name});
    res.json({ message: "Paper deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/Papers/update/:name", upload.single("image"), async (req, res) => {
  try {
    const { title,description,category,image} = req.body;  
    const updatedPaperData = {
        title,description,category,image
    };

    // If a new image is uploaded, update it
    if (req.file) {
      updatedPaperData.image = req.file.filename;
    }

    const updatedPaper = await Paper.findOneAndUpdate(
      req.params.id,
      updatedPaperData,
      { new: true, runValidators: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({ error: "Paper not found" });
    }

    res.json(updatedPaper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/count/publications", async (req, res) => {
  const count = await Paper.countDocuments();
  res.json({ count });
});
router.get("/papers/:name", async (req, res) => {
  try {
    const papers = await Paper.findOne({title:req.params.name});
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports=router