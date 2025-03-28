import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginPopup from "../components/LoginPopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddItem.css";

const sections = [
  "projects",
  "papers",
  "conferences",
  "achievements",
  "experiences",
  "collaborations",
  "blogs",
];

const AddItem = () => {
  const sectionPorts = {
    "achievements": 1000,
    "blogs": 4000,
    "collaborations": 5000,
    "conferences": 3003,
    "experiences": 7000,
    "projects": 2000,
    "papers": 8000
  };
  
  const [data, setData] = useState({});
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    name: "",
    institute: "",
    topic: "",
    date: "",
    location: "",
    summary: "",
  });

  const [selectedSection, setSelectedSection] = useState("projects");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedData = {};
      for (let section of sections) {
        const response = await axios.get(`http://localhost:${sectionPorts[selectedSection]}/${selectedSection}`);
        fetchedData[section] = response.data;
      }
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Handle form submission
  const handleAddItem = async () => {
    try {
        const formData = new FormData();
        
        // Append fields dynamically if they exist
        Object.keys(newItem).forEach((key) => {
            if (newItem[key]) {
                formData.append(key, newItem[key]);
            }
        });

        if (imageFile) {
            formData.append("image", imageFile);
        }

        console.log("Sending Data:", Object.fromEntries(formData.entries())); // Debugging

        const response = await axios.post(
            `http://localhost:${sectionPorts[selectedSection]}/${selectedSection}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        setData({ 
            ...data, 
            [selectedSection]: [...(data[selectedSection] || []), response.data] 
        });

        // Reset state after submission
        setNewItem({
            title: "",
            description: "",
            category: "",
            name: "",
            institute: "",
            topic: "",
            date: "",
            location: "",
            summary: "",
        });
        setImageFile(null);

    } catch (error) {
        console.error("Error adding item:", error);
    }
};

  
  const handleDateChange = (date) => {
    setNewItem({ ...newItem, date: date });
  };

  if (!isAuthenticated) {
    return <LoginPopup onLogin={handleLogin} />;
  }
  return (
    <div className="container mt-4">
      {/* Section Selection Dropdown */}
      <div className="mb-3">
        <label className="fw-bold">Select Section:</label>
        <select className="form-control" onChange={(e) => setSelectedSection(e.target.value)} value={selectedSection}>
          {sections.map((section) => (
            <option key={section} value={section}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Input Fields */}
      <div>
        {selectedSection === "projects" && (
          <>
            <input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="institute" placeholder="institute Name" value={newItem.institute} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="topic" placeholder="Research Topic" value={newItem.topic} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}
        {selectedSection === "collaborations" && (
          <>
            <input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="institute" placeholder="institute Name" value={newItem.institute} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="topic" placeholder="Research Topic" value={newItem.topic} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}
        {selectedSection === "blogs" && (
          <>
           <input
    type="text"
    name="title"
    placeholder="Title"
    value={newItem.title || ""}
    onChange={handleInputChange}
    className="form-control mb-2"
/>

<input
    type="text"
    name="summary"
    placeholder="Summary"
    value={newItem.summary || ""}
    onChange={handleInputChange}
    className="form-control mb-2"
/>

            
            {/* Date Picker for Date Field */}
            <label className="mx-3" htmlFor="date">Select Date: </label>
            <DatePicker
              selected={newItem.date ? new Date(newItem.date) : null}
              onChange={handleDateChange}
              className="form-control mb-2"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
            />
          </>
        )}
        {selectedSection === "papers" && (
          <>
            <input type="text" name="title" placeholder="Title" value={newItem.title} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="category" placeholder="Category" value={newItem.category} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}
        {selectedSection === "conferences" && (
          <>
            <input type="text" name="title" placeholder="Title" value={newItem.title} onChange={handleInputChange} className="form-control mb-2" />
            <input type="date" name="date" placeholder="Date" value={newItem.date} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="location" placeholder="Location" value={newItem.location} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}
        {selectedSection === "experiences" && (
          <>
            <input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="institute" placeholder="institute Name" value={newItem.institute} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="topic" placeholder="Research Topic" value={newItem.topic} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}
                {selectedSection === "achievements" && (
          <>
            <input type="text" name="name" placeholder="Title" value={newItem.name} onChange={handleInputChange} className="form-control mb-2" />
            <input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleInputChange} className="form-control mb-2" />
          </>
        )}

        {/* Image Upload Input */}
        <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mb-2" />
        {imageFile && <p className="text-success">Image uploaded: {imageFile.name}</p>}

        <button onClick={handleAddItem} className="btn btn-primary">Add Item</button>
      </div>
    </div>
  );
};

export default AddItem;