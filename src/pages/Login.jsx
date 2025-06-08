// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './RegisterDetails.css';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', {
                username : username,
                password : password
            });

            setMessage('Login successful!');
            // navigate('/');
            // Optionally redirect or store auth token here
        } catch (err) {
            console.error(err);
            setMessage('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <main>
                <section class="form-section">
                    <h1 class="form-title">Log in</h1>
                    <form onSubmit={handleLogin} class="form">
                        <label htmlFor="username" class="form-label">Log in with username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            class="form-input"
                            required
                        />

                        <label htmlFor="password" class="form-label password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            class="form-input"
                            required
                        />

                        <div class="submit-container">
                            <button type="submit" class="submit-button">Log in</button>
                            
                            <img
                                src="/google-logo.jpg"
                                alt="Google logo with red, yellow, green, and blue colors"
                                class="google-logo"
                                width="40"
                                height="40"
                            />
                        </div>
                        {message && <p>{message}</p>}
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Login;
