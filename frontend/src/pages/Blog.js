import React, { useState, useEffect } from "react";
import { Card, Container, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/blogs");
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blog data.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCriteria(e.target.value);
  };

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      !filterCriteria ||
      blog.title.toLowerCase().includes(filterCriteria.toLowerCase()) ||
      blog.summary.toLowerCase().includes(filterCriteria.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Professor's Blog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Insights, thoughts, and updates from my academic journey
        </motion.p>
      </div>

      <Container>
        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="search-filter-section"
        >
          <div className="row g-4">
            <div className="col-md-6">
              <Form.Control 
                type="text" 
                placeholder="Search Blogs" 
                value={searchTerm} 
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-6">
              <Form.Select 
                value={filterCriteria} 
                onChange={handleFilterChange} 
                aria-label="Filter Blogs"
              >
                <option value="">Select Keyword</option>
                <option value="AI">AI</option>
                <option value="Blockchain">Blockchain</option>
                <option value="IoT">IoT</option>
                <option value="Smart Cities">Smart Cities</option>
                <option value="Big Data">Big Data</option>
              </Form.Select>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="blog-card"
              >
                <img
                  src={`http://localhost:4000/uploads/${blog.image}`}
                  alt={blog.title}
                  className="blog-image"
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="text-muted">{blog.date}</p>
                  <p className="card-text">{blog.summary}</p>
                  <Button 
                    variant="primary" 
                    onClick={() => handleReadMore(blog)}
                    className="mt-auto"
                  >
                    Read More
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="error-message">
              <p>No blogs found based on the selected filters.</p>
            </div>
          )}
        </div>

        {/* Blog Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="blog-modal"
        >
          {selectedBlog && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedBlog.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={`http://localhost:4000/uploads/${selectedBlog.image}`}
                  alt={selectedBlog.title}
                />
                <p className="text-muted">{selectedBlog.date}</p>
                <p>{selectedBlog.fullContent}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </div>
  );
};

export default Blog;
