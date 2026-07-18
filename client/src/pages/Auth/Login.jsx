import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

   const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post("http://localhost:3000/login", { email, password })
        .then(result => {
            if (result.data && result.data.user) {
                localStorage.setItem('user', JSON.stringify(result.data.user));
                localStorage.setItem('token', result.data.user._id);

                // FORCE A RELOAD to clear any stale state
                // This forces the App to re-check localStorage and refresh the Navbar
                window.location.href = result.data.user.isAdmin ? "/admin" : "/";
            }
        })
        .catch(error => {
            // Only alert if it's actually an error with the login
            console.error("Login error:", error);
            alert("Login failed. Check console for details.");
        });
};

    return (
        <div className="mainbox">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input 
                    type="email"
                    placeholder="Email"
                    value={email} /* Added for controlled input best practice */
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password} /* Added for controlled input best practice */
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />

                <p>Don't have an account? <Link to="/signup">Register</Link></p>

                <button className='btn' type="submit">Log In</button>
            </form>
        </div>
    );
};
