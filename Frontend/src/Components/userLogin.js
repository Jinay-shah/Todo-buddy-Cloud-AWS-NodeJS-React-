import React, { useState, useEffect } from 'react';
import '../Styles/userLogin.css'; 
import { useNavigate } from 'react-router-dom';
import APIs from '../constants';


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  // Validation function for username format
  const validateUsername = (username) => {
    // Username should be at least 3 characters long
    return username.length >= 3;
  };

  // Validation function for password format
  const validatePassword = (password) => {
    // Password should be at least 8 characters long and contain at least one uppercase letter and one numeric digit
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages and login success message
    setUsernameError('');
    setPasswordError('');
    setLoginSuccess(false);
    setLoginError('');

    // Check username format
    if (!validateUsername(username)) {
      setUsernameError('Username should be at least 3 characters long');
      return;
    }

    // Check password format
    if (!validatePassword(password)) {
      setPasswordError('Password should be at least 8 characters long and contain at least one uppercase letter and one numeric digit');
      return;
    }

    // If all validations pass, send a login request to your backend API
    try {
      const response = await fetch(APIs.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Login was successful
        const data = await response.json();
        const { user } = data;
        // Store the userId in local storage
        localStorage.setItem('userId', user.userId);
        setLoginSuccess(true);
         // Redirect to the "todo" page
        navigate('/todo');
      } else {
        setLoginError('Invalid username or password!');
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const handleRegisterClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <div className="error">{usernameError}</div>}
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
          {loginSuccess ? (
            <div className="success">Login success!</div>
          ) : (
            <>
              {loginError && <div className="error">{loginError}</div>}
              <button type="submit" className="login-button">
                Login
              </button>
            </>
          )}
        </form>
      </div>
      <a href="/" className="register-link" onClick={handleRegisterClick}>
        Register?
      </a>
    </div>
  );
}

export default LoginForm;
