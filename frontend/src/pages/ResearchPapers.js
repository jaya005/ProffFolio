import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import "./ResearchPapers.css";

const ResearchPapers = () => {
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await axios.get("https://profffolio-2.onrender.com/Papers");
      setPapers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching research papers:", error);
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((paper) => {
    return (
      (category === "All" || paper.category === category) &&
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleReadMore = (paper) => {
    setSelectedPaper(paper);
    setShowModal(true);
  };

  return (
    <div className="research-papers-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Research Papers
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Explore my collection of research papers and academic publications
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
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Control
                type="text"
                placeholder="Search research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="All">All Categories</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Quantum">Quantum Computing</option>
                <option value="IoT">IoT & Smart Cities</option>
              </Form.Select>
            </Col>
          </Row>
        </motion.div>

        {/* Papers Grid */}
        <div className="container mt-5">
          {loading ? (
            <div className="text-center">
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading papers...</p>
              </div>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="row justify-content-center g-4">
              {filteredPapers.map((paper, index) => (
                <motion.div
                  key={paper._id}
                  className="col-sm-6 col-md-4 d-flex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="paper-card">
                    <div className="card-image-container">
                      <img
                        src={`https://profffolio-2.onrender.com/uploads/${paper.image}`}
                        alt={paper.title}
                      />
                      <div className="card-overlay">
                        <Button 
                          variant="light" 
                          onClick={() => handleReadMore(paper)}
                          className="read-more-btn"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                    <div className="card-body">
                      <span className="category-badge">{paper.category}</span>
                      <h5 className="card-title">{paper.title}</h5>
                      <p className="card-text">{paper.description.substring(0, 100)}...</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="no-results">
                <p>No research papers found matching your criteria.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Paper Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="paper-modal"
        >
          {selectedPaper && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedPaper.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-image-container">
                  <img
                    src={`https://profffolio-2.onrender.com/uploads/${selectedPaper.image}`}
                    alt={selectedPaper.title}
                  />
                </div>
                <h5>{selectedPaper.category}</h5>
                <h6>Research Paper</h6>
                <p>{selectedPaper.description}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  variant="primary" 
                  href={selectedPaper.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read Full Paper
                </Button>
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

export default ResearchPapers;