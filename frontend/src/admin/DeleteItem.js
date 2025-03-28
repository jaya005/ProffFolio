import React, { useState, useEffect } from "react";
import axios from "axios";

const sections = [
  "projects",
  "papers",
  "conferences",
  "achievements",
  "experiences",
  "collaborations",
  "blogs",
];

const sectionPorts = {
  achievements: 1000,
  blogs: 4000,
  collaborations: 5000,
  conferences: 3003,
  experiences: 7000,
  projects: 2000,
  papers: 8000,
};

const DeleteItem = () => {
  const [selectedSection, setSelectedSection] = useState("projects");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    fetchItems();
  }, [selectedSection]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:${sectionPorts[selectedSection]}/${selectedSection}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDeleteItem = async (name) => {
    if (!name.trim()) {
      alert("Please enter a valid item name.");
      return;
    }
  
    try {
      const formattedName = encodeURIComponent(name.trim());
      console.log("Sending DELETE request for:", formattedName);
  
      const response = await axios.delete(
        `http://localhost:${sectionPorts[selectedSection]}/${selectedSection}/delete/${formattedName}`
      );
  
      console.log("Delete response:", response.data);
      setItems(items.filter((item) => item.name !== name));
      setSearchQuery("");
    } catch (error) {
      console.error("Error deleting item:", error.response?.data || error.message);
    }
  };
  

  if (!isAuthenticated) {
    return <p>Please log in to delete items.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Delete Item</h2>

      {/* Select Section */}
      <div className="mb-3">
        <label className="fw-bold">Select Section:</label>
        <select
          className="form-control"
          onChange={(e) => setSelectedSection(e.target.value)}
          value={selectedSection}
        >
          {sections.map((section) => (
            <option key={section} value={section}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <label className="fw-bold">Enter item to be deleted:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter item name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Delete Button */}
      <button className="btn btn-danger" onClick={() => handleDeleteItem(searchQuery)}>
        Delete
      </button>
    </div>
  );
};

export default DeleteItem;
