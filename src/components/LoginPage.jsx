import './LoginPage.css'

import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        // Handle login logic here
        try {
            console.log('Logging in:', { username, password });
            const response = await axios.post('http://localhost:8080/login', { username, password });
            console.log('users data:', response.data);
            alert('Login Success');
            navigate('/home');
      
        } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred during login. Please try again.');
        }
    };

    return (
      <div className="login-container">
          <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
            </form>
          <Link to="/index">Back</Link>
      </div>
    )
  }
  
  export default LoginPage
  