import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './SignUp.css'
import axios from 'axios'

const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate= useNavigate();
  const handleSubmit= (e) =>{
    e.preventDefault();
    axios.post("http://localhost:3000/register",{name,email ,password})
    .then(result=>{console.log(result)
        navigate("/")
    })
    .catch(err=>console.log(err))
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>

        <input 
         type="text"
         name="username"
         placeholder="Username"
         onChange={(e=>setname(e.target.value))}
         required />


        <input
         type="email"
         name="email"
         placeholder="Email"
         onChange={(e=>setemail(e.target.value))}
         required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e=>setpassword(e.target.value))}
          required
        />

        <span className="to-login">
          {" "}
          <Link to="/"> Already have an account?</Link>
        </span>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
