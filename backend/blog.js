const mongoose=require('mongoose')
mongoose.connect(`mongodb://localhost:27017/proffolio`)
const express = require("express");
const multer=require('multer')
const path = require("path");

const app=express()
const cors=require('cors')
app.use(cors())
app.use("/uploads", express.static("uploads"));

const blogSchema=new mongoose.Schema({
    title:String,
    summary:String,
    image:String,
    date:Date
})
const blog=mongoose.model('blog',blogSchema)
app.use(express.json())
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Corrected filename generation
    },
});

  
  const upload = multer({ storage });
// GET all blogs
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new blog
app.post("/blogs", upload.single("image"),async (req, res) => {
  try {
    const { title, summary,date} = req.body;
    const formattedDate = date ? new Date(date) : new Date();
    const image = req.file ? req.file.filename : null;
    const newblog = new blog({ title, summary,formattedDate, image });
    await newblog.save();
    res.status(201).json(newblog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an blog by ID
app.delete("/blogs/delete/:title", async (req, res) => {
  try {
    const deletedBlog = await blog.findOneAndDelete({ title: req.params.title });
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a blog by ID
app.put("/blogs/update/:name", upload.single("image"), async (req, res) => {
  try {
      const { title, summary, date } = req.body;
      const formattedDate = date ? new Date(date) : undefined;

      const updatedBlogData = {
          title,
          summary,
          date: formattedDate,  // Correct field name
      };

      // If a new image is uploaded, update it
      if (req.file) {
          updatedBlogData.image = req.file.filename;
      }

      const updatedBlog = await blog.findOneAndUpdate(
          { title: req.params.name },  // Correct filter for searching by title
          updatedBlogData,
          { new: true, runValidators: true }
      );

      if (!updatedBlog) {
          return res.status(404).json({ error: "Blog not found" });
      }

      res.json(updatedBlog);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

  app.get("/count/blogposts", async (req, res) => {
    const count = await blog.countDocuments();
    res.json({ count });
  });
  app.get("/blogs/:name", async (req, res) => {
    try {
      const blogs = await blog.findOne({title:req.params.name});
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.listen(4000)
