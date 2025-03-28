import React, { useState } from 'react';
import './LoginPopup.css';

const LoginPopup = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // New password field for updating
  const [error, setError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // To toggle between login and update password views

  // Dummy user credentials for testing
  const dummyUser = { userId: 'admin', password: 'admin123' };

  const handleLogin = () => {
    if (userId === dummyUser.userId && password === dummyUser.password) {
      const token = 'dummy-jwt-token'; 
      localStorage.setItem('token', token);
      onLogin(token);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleUpdatePassword = () => {
    // Check if the old password matches the dummy user password
    if (userId === dummyUser.userId && password === dummyUser.password) {
      // Update the password logic
      if (newPassword.trim() === '') {
        setError('Please enter a new password.');
        return;
      }

      // Simulate updating password (In a real case, you would update the password in the backend)
      setError('Password updated successfully.');
      setIsUpdatingPassword(false); // Switch back to login view after updating
    } else {
      setError('Old password is incorrect. Please try again.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <h2>{isUpdatingPassword ? 'Update Password' : 'Admin Login'}</h2>
        {error && <p className="error-text">{error}</p>}

        {/* Login form */}
        {!isUpdatingPassword && (
          <>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {/* <button onClick={() => setIsUpdatingPassword(true)} className="forgot-password-btn">
              Update Password
            </button> */}
          </>
        )}

        {/* Update password form */}
        {isUpdatingPassword && (
          <>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Old Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* <button onClick={handleUpdatePassword}>Update Password</button> */}
            {/* <button onClick={() => setIsUpdatingPassword(false)}>Back to Login</button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
