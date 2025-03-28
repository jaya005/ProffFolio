import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // This will help us extract the token from the URL

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get the token from the URL (it will be passed as a query parameter)
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  // Handle the reset password process
  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError('Invalid or expired token.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="reset-password-container">
      {success ? (
        <h2>Password Reset Successfully!</h2>
      ) : (
        <>
          <h2>Reset Password</h2>
          {error && <p className="error-text">{error}</p>}
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
