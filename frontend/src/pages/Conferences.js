import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Conferences.css";

const Conferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConf, setSelectedConf] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const response = await axios.get("http://localhost:5000/conferences");
      setConferences(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conferences:", error);
      setError("Failed to load conferences.");
      setLoading(false);
    }
  };

  const handleShowModal = (conf) => {
    setSelectedConf(conf);
    setShowModal(true);
  };

  return (
    <div className="conferences-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Conferences
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Explore my participation in various conferences and academic events
        </motion.p>
      </div>

      <Container>
        {/* Conferences Grid */}
        <div className="container mt-5">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading conferences...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <div className="row justify-content-center g-4">
              {conferences.map((conf, index) => (
                <motion.div
                  key={conf.id}
                  className="col-sm-6 col-md-4 d-flex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="conf-card">
                    <img
                      src={`http://localhost:5000/uploads/${conf.image}`}
                      alt={conf.title}
                      className="conf-image card-image-container"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{conf.title}</h5>
                      <p className="card-text">{conf.description}</p>
                      <Button 
                        variant="primary" 
                        onClick={() => handleShowModal(conf)}
                        className="mt-auto"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Conference Details */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="conference-modal"
        >
          {selectedConf && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedConf.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="card-image-container">
                <img
                  src={`http://localhost:5000/uploads/${selectedConf.image}`}
                  alt={selectedConf.title}
                />
                </div>
                <p>
                  <span className="text-muted">{selectedConf.date}</span>
                </p>
                <p>
                  <span className="text-muted">{selectedConf.location}</span>
                </p>
                <p>{selectedConf.description}</p>
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

export default Conferences;
