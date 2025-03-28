import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login (You can replace this with actual authentication logic)
    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Login Successful!");
      localStorage.setItem("isAuthenticated", "true"); // Save login state
      setIsAuthenticated(true);
      navigate("/admin");
    } else {
      alert("Invalid credentials! Try again.");
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="card p-4 shadow-lg rounded" style={{ width: "350px" }}>
        <h3 className="text-center text-primary fw-bold mb-3">Welcome Back</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
