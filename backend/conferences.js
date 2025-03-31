const mongoose=require('mongoose')
const express = require("express");
const multer=require('multer')
const path = require("path");
const router = express.Router();
router.use("/uploads", express.static("uploads"));


const conferenceschema=new mongoose.Schema({
    title:String,
    description:String,
    location:String,
    image:String,
    date:Date
})
const Conference=mongoose.model('Conference',conferenceschema)
router.use(express.json())
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all conferences
router.get("/conferences", async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new Conference
router.post("/conferences", upload.single("image"),async (req, res) => {
  try {
    const { title,description,location,date} = req.body;
    const image = req.file ? req.file.filename : null;
    const date2=new Date(date)
    const newConference = new Conference({title,description,location,date2,image });
    await newConference.save();
    res.status(201).json(newConference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an Conference by ID
router.delete("/conferences/delete/:name", async (req, res) => {
  try {
    await Conference.findOneAndDelete({title:req.params.name});
    res.json({ message: "Conference deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/conferences/update/:name", upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, date } = req.body;  
    const date2 = new Date(date);  // Correct date conversion

    const updatedConferenceData = { title, description, location, date2 };

    // If a new image is uploaded, update it
    if (req.file) {
      updatedConferenceData.image = req.file.filename;
    }

    const updatedConference = await Conference.findOneAndUpdate(
      { title: req.params.name },  // Correct filter for searching by title
      updatedConferenceData,
      { new: true, runValidators: true }
    );

    if (!updatedConference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    res.json(updatedConference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/count/conferences", async (req, res) => {
  const count = await Conference.countDocuments();
  res.json({ count });
});
router.get("/conferences/:name", async (req, res) => {
  try {
    const conferences = await Conference.findOne({title:req.params.name});
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports=router