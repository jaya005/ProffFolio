import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/projects");
      setProjects(response.data);
      setFilteredProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, filterCriteria);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterCriteria(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search, category) => {
    let filtered = projects;

    if (category) {
      filtered = filtered.filter((project) =>
        project.topic.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.institute.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleShowMore = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          My Projects
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Explore my portfolio of innovative projects and technical achievements
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
                placeholder="Search projects by name or institute..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Select value={filterCriteria} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="AI">AI</option>
                <option value="Blockchain">Blockchain</option>
                <option value="IoT">IoT</option>
                <option value="Quantum">Quantum</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Drones">Drones</option>
              </Form.Select>
            </Col>
          </Row>
        </motion.div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {loading ? (
            <div className="text-center">
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading projects...</p>
              </div>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="project-card"
              >
                <div className="card-image-container">
                  <img
                    src={`http://localhost:5000/uploads/${project.image}`}
                    alt={project.name}
                    
                  />
                  <div className="card-overlay">
                    <Button 
                      variant="light" 
                      onClick={() => handleShowMore(project)}
                      className="view-details-btn"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="card-body">
                  <span className="topic-badge">{project.topic}</span>
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">{project.institute}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center">
              <div className="no-results">
                <p>No projects found matching your criteria.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCriteria("");
                    setFilteredProjects(projects);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Project Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="project-modal"
        >
          {selectedProject && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedProject.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-image-container">
                  <img
                    src={`http://localhost:5000/uploads/${selectedProject.image}`}
                    alt={selectedProject.name}
                  />
                </div>
                <h5>{selectedProject.institute}</h5>
                <h6>{selectedProject.topic}</h6>
                <p>{selectedProject.description}</p>
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

export default Projects;