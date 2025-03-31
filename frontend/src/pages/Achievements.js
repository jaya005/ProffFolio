import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import "./Achievements.css";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/achievements");
      setAchievements(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Failed to load achievements data.");
      setLoading(false);
    }
  };

  const handleReadMore = (achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  return (
    <div className="achievements-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          My Achievements
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Milestones and accomplishments that mark my journey
        </motion.p>
      </div>

      <div className="container mt-5">
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading achievements...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        )}

        <div className="row justify-content-center g-4">
          {achievements.map((achievement, index) => (
            <motion.div 
              className="col-sm-6 col-md-4 d-flex"
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="achievement-card">
                <div className="card-image-container">
                  <img
                    src={`http://localhost:5000/uploads/${achievement.image}`}
                    alt={achievement.name}
                    className="card-img-top"
                  />
                  <div className="card-overlay">
                    <button
                      className="btn btn-light read-more-btn"
                      onClick={() => handleReadMore(achievement)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{achievement.name}</h5>
                  <p className="card-text">{achievement.description.substring(0, 100)}...</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        className="achievement-modal"
      >
        {selectedAchievement && (
          <>
            <Modal.Header closeButton className="modal-header">
              <Modal.Title>{selectedAchievement.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              <div className="modal-image-container">
                <img
                  src={`http://localhost:5000/uploads/${selectedAchievement.image}`}
                  alt={selectedAchievement.name}
                  className="modal-image"
                />
              </div>
              <div className="modal-content">
                <p className="modal-description">{selectedAchievement.description}</p>
              </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Achievements;
