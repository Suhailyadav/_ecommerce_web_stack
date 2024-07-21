import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './Register.css'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  })

  const navigate = useNavigate()
  const handleInput = (e) => {
    let name = e.target.name
    let value = e.target.value

    setUser({
      ...user,
      [name]: value,
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        
        setUser({
          username: "",
          email: "",
          password: "",
          fullName: "",
        })
        navigate('/login');
      }
    } catch (error) {
      console.log('register', error);
    }
  }

  return (
    <section className="register-section">
      <div className="register-container">
        <div className="register-card">
        <h2 className="register">Register</h2>
          <form onSubmit={handleSubmit}>
           
            <p id="passwordError" />

            <input 
            type="text" 
            name="username"
            placeholder="Username" 
            required
            value={user.username}
            onChange={handleInput}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              required
              value={user.password}
              onChange={handleInput}
            />
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="full name"
              required
              value={user.fullName}
              onChange={handleInput}
            />
            <input 
            type="email" 
            id="email" 
            placeholder="E-mail" 
            name="email"
            required
            value={user.email}
            onChange={handleInput}
            />
            <button
              className="tombol-register"
              type="submit"
              id="registerButton"
            >
              Register
            </button>
          </form>
          <div className="switch">
            <h5>Already have account?</h5>
            <NavLink to="/login" >Login</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
