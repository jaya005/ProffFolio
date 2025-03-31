import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ResearchPapers from "./pages/ResearchPapers";
import Conferences from "./pages/Conferences";
import Achievements from "./pages/Achievements";
import TeachingExperience from "./pages/TeachingExperience";
import Collaborations from "./pages/Collaborations";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "../Login";
import MyNavbar from "./components/MyNavbar"; 
import AddItem from "./admin/AddItem";
import DeleteItem from "./admin/DeleteItem";
import UpdateItem from "./admin/UpdateItem";
import { useState } from "react";
import { Navigate } from "react-router-dom";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
       <MyNavbar isAuthenticated={isAuthenticated} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/research-papers" element={<ResearchPapers />} />
        <Route path="/conferences" element={<Conferences />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/teaching-experience" element={<TeachingExperience />} />
        <Route path="/collaborations" element={<Collaborations />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/deleteItem" element={<DeleteItem />} />
        <Route path="/updateItem" element={<UpdateItem />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
