import './RegisterPage.css'

import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';


function RegisterPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
      
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
      
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
      
        try {
            
            // Handle registration logic here
            console.log('Registering:', { username, password , confirmPassword});
            await axios.post('http://localhost:8080/register', { username, password });
            alert('Register success');
            navigate('/login');
      
        } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred during registration. Please try again.');
        }
      };

    return (
      <div className="register-container">
            <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                    type="text"
                    placeholder="Username *"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ConfirmPassword *"
                    required
                    />
                    <button type="submit">Register</button>
                </form>
            <Link to="/index">Back</Link>
      </div>
    )
  }
  
  export default RegisterPage
  