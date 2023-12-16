import React, { useState } from 'react';
import '../Styles/userRegistration.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import APIs from '../constants';

function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emptyFieldError, setEmptyFieldError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigate to the login page when the "Login here" link is clicked
    navigate('/login');
  };

  // Validation function for email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  // Validation function for password format
  const validatePassword = (password) => {
    // Password should be at least 8 characters long and contain at least one uppercase letter and one numeric digit
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages and success message
    setEmailError('');
    setPasswordError('');
    setEmptyFieldError('');
    setRegistrationSuccess(false);

    // Check for empty fields
    if (!name || !email || !username || !password) {
      setEmptyFieldError('All fields are required !');
      return;
    }

    // Check email format
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Check password format
    if (!validatePassword(password)) {
      setPasswordError(
        'Invalid password format. At least one Upper case, one numeric value and atleast 8 character required!'
      );
      return;
    }

    // If all validations pass, send a registration request to the backend API
    try {
      const response = await fetch(
        APIs.REGISTER,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, username, password }),
        }
      );

      if (response.ok) {
        // Registration was successful
        setRegistrationSuccess(true);
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Register to start</h2>
        {registrationSuccess ? (
          <div className="success">
            Registration successful!{' '}
            <button className="login-button" onClick={handleLoginClick}>
              Login here
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="error">{emailError}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </div>
            {emptyFieldError && <div className="error">{emptyFieldError}</div>}
            <button type="submit" className="registration-button">
              Register
            </button>
            <span className="login-text">Already registered? </span>
            <a href="/login" className="login-link" onClick={handleLoginClick}>
              Login here
            </a>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;
