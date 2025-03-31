const mongoose=require('mongoose')
const express = require("express");
const multer=require('multer')
const path = require("path");
const router = express.Router();


const projectSchema=new mongoose.Schema({
    name:String,
    institute:String,
    topic:String,
    image:String
})
const Project=mongoose.model('Project',projectSchema)
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage });
// GET all Projects
router.get("/Projects", async (req, res) => {
  try {
    const Projects = await Project.find();
    res.json(Projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/Projects", upload.single("image"),async (req, res) => {
  try {
    const { name, institute,topic} = req.body;
    const image = req.file ? req.file.filename : null;
    const newProject = new Project({ name,institute,topic, image });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an Project by ID
router.delete("/projects/delete/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    console.log("Received DELETE request for:", name);

    const project = await Project.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } });

    if (!project) {
      console.log("Project not found:", name);
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findOneAndDelete({ name: { $regex: new RegExp("^" + name + "$", "i") } });
    console.log("Deleted successfully:", name);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// UPDATE a Project by ID
router.put("/Projects/update/:name", upload.single("image"), async (req, res) => {
    try {
      const { name,image,institute,topic } = req.body;  
      const updatedProjectData = {
        name,image,institute,topic
      };
  
      // If a new image is uploaded, update it
      if (req.file) {
        updatedProjectData.image = req.file.filename;
      }
  
      const updatedProject = await Project.findOneAndUpdate(
        req.params.id,
        updatedProjectData,
        { new: true, runValidators: true }
      );
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      res.json(updatedProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.get("/count/projects", async (req, res) => {
    const count = await Project.countDocuments();
    res.json({ count });
  });
  router.get("/projects/:name", async (req, res) => {
    try {
      const projects = await Project.findOne({name:req.params.name});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  module.exports=router