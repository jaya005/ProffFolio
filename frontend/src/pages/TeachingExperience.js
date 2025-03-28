import React, { useState, useEffect } from "react";
import { Card, Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import "./TeachingExperience.css";

const TeachingExperience = () => {
  const [teachingExperiences, setTeachingExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTeachingExperiences();
  }, []);

  const fetchTeachingExperiences = async () => {
    try {
      const response = await axios.get("http://localhost:7000/experiences");
      setTeachingExperiences(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teaching experiences:", error);
      setError("Failed to load teaching experiences.");
      setLoading(false);
    }
  };

  const handleShowMore = (experience) => {
    setSelectedExperience(experience);
    setShowModal(true);
  };

  return (
    <div className="teaching-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Teaching Experience
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Explore my journey in education and teaching
        </motion.p>
      </div>

      <Container>
        {/* Teaching Experience Grid */}
        <div className="container mt-5">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading teaching experiences...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <div className="row g-4">
              {teachingExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  className="col-12 col-sm-6 col-md-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="experience-card h-100">
                    <div className="card-image-container">
                      <img
                        src={`http://localhost:7000/uploads/${experience.image}`}
                        alt={experience.name}
                        className="experience-image"
                      />
                      <div className="card-overlay">
                        <Button 
                          variant="light" 
                          onClick={() => handleShowMore(experience)}
                          className="read-more-btn"
                        >
                          View More
                        </Button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{experience.name}</h5>
                      <p className="text-muted">{experience.institution}</p>
                      <p className="card-text">{experience.course}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Viewing Full Details */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="experience-modal"
        >
          {selectedExperience && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedExperience.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={`http://localhost:7000/uploads/${selectedExperience.image}`}
                  alt={selectedExperience.name}
                />
                <h5 className="mt-2">{selectedExperience.institute}</h5>
                <p>{selectedExperience.topic}</p>
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

export default TeachingExperience;
