import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserEdit, FaBookOpen, FaAward, FaProjectDiagram, 
         FaNewspaper, FaHandshake, FaBlog, FaSignOutAlt, 
         FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import axios from "axios"; // Import axios for API calls
import "./AdminDashboard.css";

const AdminDashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  // State to store the actual counts
  const [counts, setCounts] = useState({
    projects: 0,
    publications: 0,
    achievements: 0,
    conferences: 0,
    collaborations: 0,
    blogPosts: 0,
  });

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (!authStatus || authStatus !== "true") {
      navigate("/login");
    }

    // Fetch data from the backend
    const fetchCounts = async () => {
      try {
        const projects = await axios.get(`http://localhost:${5000}/count/projects`);
        const publications = await axios.get(`http://localhost:${5000}/count/publications`);
        const achievements = await axios.get(`http://localhost:${5000}/count/achievements`);
        const conferences = await axios.get(`http://localhost:${5000}/count/conferences`);
        const collaborations = await axios.get(`http://localhost:${5000}/count/collaborations`);
        const blogPosts = await axios.get(`http://localhost:${5000}/count/blogposts`);

        setCounts({
          projects: projects.data.count,
          publications: publications.data.count,
          achievements: achievements.data.count,
          conferences: conferences.data.count,
          collaborations: collaborations.data.count,
          blogPosts: blogPosts.data.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-nav">
        <h1>Professor Portfolio Admin</h1>
        <button className="logout-btn" onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
            navigate("/login");
          }
        }}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="dashboard-container">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/addItem" className="action-btn add">
              <FaPlus /> Add New
            </Link>
            <Link to="/DeleteItem" className="action-btn delete">
              <FaTrash /> Delete
            </Link>
            <Link to="/UpdateItem" className="action-btn update">
              <FaPencilAlt /> Update
            </Link>
          </div>
        </div>

        <div className="sections-grid">
  {[
    { name: "Profile", icon: <FaUserEdit />, color: "#4361ee", count: counts.profile },
    { name: "Projects", icon: <FaProjectDiagram />, color: "#3a0ca3", count: counts.projects },
    { name: "Publications", icon: <FaBookOpen />, color: "#7209b7", count: counts.publications },
    { name: "Achievements", icon: <FaAward />, color: "#f72585", count: counts.achievements },
    { name: "Conferences", icon: <FaNewspaper />, color: "#4895ef", count: counts.conferences },
    { name: "Collaborations", icon: <FaHandshake />, color: "#560bad", count: counts.collaborations },
    { name: "Blog Posts", icon: <FaBlog />, color: "#4cc9f0", count: counts.blogPosts },
  ].map((section) => (
    <div key={section.name} className="section-card" style={{ borderColor: section.color }}>
      <div className="section-icon" style={{ color: section.color }}>
        {section.icon}
      </div>
      <h3>{section.name}</h3>
      <p className="section-count">Total: {section.count}</p>
      <div className="section-actions">
        <Link to={`/addItem`} className="btn-small">
          <FaPlus /> Add
        </Link>
        <Link to={`/updateItem`} className="btn-small">
          Manage
        </Link>
      </div>
    </div>
  ))}
</div>


        <div className="dashboard-stats">
          <h2>Quick Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Projects</h4>
              <p>{counts.projects}</p>
            </div>
            <div className="stat-card">
              <h4>Publications</h4>
              <p>{counts.publications}</p>
            </div>
            <div className="stat-card">
              <h4>Collaborations</h4>
              <p>{counts.collaborations}</p>
            </div>
            <div className="stat-card">
              <h4>Blog Posts</h4>
              <p>{counts.blogPosts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
