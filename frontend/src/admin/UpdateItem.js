import React, { useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

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
  achievements: 5000,
  blogs: 5000,
  collaborations: 5000,
  conferences: 5000,
  experiences: 5000,
  projects: 5000,
  papers: 5000,
};

const UpdateItem = () => {
  const [selectedSection, setSelectedSection] = useState("projects");
  const [itemName, setItemName] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleFetchItem = async () => {
    if (!itemName.trim()) {
      setErrorMessage("Please enter an item name.");
      return;
    }
    setErrorMessage("");

    try {
      const response = await axios.get(
        `http://localhost:${sectionPorts[selectedSection]}/${selectedSection}/${encodeURIComponent(
          itemName
        )}`
      );

      if (response.data) {
        setUpdateData(response.data);
      } else {
        setErrorMessage("No data found for this item.");
        setUpdateData({});
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      setErrorMessage("Failed to fetch item. Please check the item name.");
    }
  };

  const handleUpdateItem = async () => {
    if (!itemName.trim()) {
      setErrorMessage("Please enter an item name before updating.");
      return;
    }
    setErrorMessage("");

    try {
      const formData = new FormData();
      Object.keys(updateData).forEach((key) => {
        formData.append(key, updateData[key]);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(
        `http://localhost:${sectionPorts[selectedSection]}/${selectedSection}/update/${encodeURIComponent(itemName)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
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

      <div className="mb-3">
        <label className="fw-bold">Enter Item Name to Update:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <button onClick={handleFetchItem} className="btn btn-primary mt-2">
          Fetch Item
        </button>
      </div>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      {Object.keys(updateData).length > 0 && (
        <div>
          {Object.keys(updateData)
            .filter((key) => key !== "_id" && key !== "__v" && key !== "image")
            .map((key) => (
              <div key={key} className="mb-2">
                <label className="fw-bold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  type="text"
                  name={key}
                  className="form-control"
                  value={updateData[key] || ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}

          {/* Display current image if exists */}
          {updateData.image && (
            <div className="mb-3">
              <label className="fw-bold">Current Image:</label>
              <div>
                <img
                  src={`http://localhost:${sectionPorts[selectedSection]}/uploads/${updateData.image}`}
                  alt="Current"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="fw-bold">Upload New Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
            {imageFile && <p className="text-success">Image uploaded: {imageFile.name}</p>}
          </div>

          <button onClick={handleUpdateItem} className="btn btn-success">
            Update Item
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;
