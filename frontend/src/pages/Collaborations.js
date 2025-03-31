import React, { useState, useEffect } from "react";
import { Card, Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import "./Collaborations.css";

const Collaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/collaborations");
      setCollaborations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      setError("Failed to load collaborations.");
      setLoading(false);
    }
  };

  const handleShowMore = (collab) => {
    setSelectedCollab(collab);
    setShowModal(true);
  };

  return (
    <div className="collaborations-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Collaborations
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Exploring partnerships and research collaborations across institutions
        </motion.p>
      </div>

      <Container>
        {/* Collaborations Grid */}
        <div className="collaborations-grid">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading collaborations...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            collaborations.map((collab, index) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="collab-card"
              >
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/uploads/${collab.image}`}
                    alt={collab.name}
                    className="collab-image"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{collab.name}</h5>
                  <p className="text-muted">{collab.institute}</p>
                  <p className="card-text">{collab.topic}</p>
                  <Button 
                    variant="primary" 
                    onClick={() => handleShowMore(collab)}
                    className="mt-auto"
                  >
                    View More
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal for Viewing Full Details */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="collab-modal"
        >
          {selectedCollab && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedCollab.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={`http://localhost:5000/uploads/${selectedCollab.image}`}
                  alt={selectedCollab.name}
                />
                <h5 className="mt-2">{selectedCollab.institution}</h5>
                <p className="text-muted">{selectedCollab.researchTopic}</p>
                <p>{selectedCollab.description}</p>
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

export default Collaborations;
