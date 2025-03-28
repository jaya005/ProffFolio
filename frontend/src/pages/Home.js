import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa"; // For social media icons
import { motion } from "framer-motion";
import "./Home.css"; // Custom CSS file for additional styling

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Welcome to My Portfolio
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Explore the academic and professional journey of Professor HC Verma,
          a dedicated educator, researcher, and innovator.
        </motion.p>
      </div>

      <Container>
        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="about-section p-5"
        >
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="about-title">About Professor HC Verma</h2>
              <p className="about-text">
                Professor HC Verma is a passionate academic with over 16 years of
                experience in Physics. Dedicated to fostering a learning
                environment that encourages creativity and critical thinking, 
                Professor HC Verma has made significant contributions to his specific research, teaching areas.
              </p>
            </Col>
            <Col md={6}>
              <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                src="https://www.iitk.ac.in/new/images/events/Prof-H-C-Verma.jpeg"
                alt="HC Verma"
                className="professor-image mx-5"
              />
            </Col>
          </Row>
        </motion.div>

        {/* Social Links Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="social-section"
        >
          <h3 className="social-title">Connect with Professor HC Verma</h3>
          <div className="social-links">
            <motion.a 
              whileHover={{ y: -5 }}
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin className="social-icon" />
            </motion.a>
            <motion.a 
              whileHover={{ y: -5 }}
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaGithub className="social-icon" />
            </motion.a>
            <motion.a 
              whileHover={{ y: -5 }}
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaTwitter className="social-icon" />
            </motion.a>
            <motion.a 
              whileHover={{ y: -5 }}
              href="mailto:professor@example.com"
            >
              <FaEnvelope className="social-icon" />
            </motion.a>
          </div>
        </motion.div>
      </Container>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="footer"
      >
        <Container className="text-center">
          <p className="footer-text">© 2025 Professor HC Verma. All Rights Reserved.</p>
          <p className="footer-text">Designed with passion and dedication.</p>
        </Container>
      </motion.footer>
    </div>
  );
};

export default Home;
