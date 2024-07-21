import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";
import { NavLink } from "react-router-dom";
import './Login.css'


const Login = () => {
  const [user, setUser] = useState({
    identifier: "",
    password: "",
  });

   

  const navigate = useNavigate()
  const {storeTokenInLS} = useAuth();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmail = user.identifier.includes("@");
    const requestBody = isEmail
    ? { email: user.identifier, password: user.password }
    : { username: user.identifier, password: user.password };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }); 

      if(response.ok) {
        alert("Login successful")
        const res_data = await response.json();
        storeTokenInLS(res_data.data.accessToken)

        setUser({identifier: "", password: ""});
        
        
        navigate('/products')
      } else {
        alert("invalid credentials");
        console.log("invalid credentials");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="login-section">
     <div className="login-container">
      <div className="login-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="identifier"
          placeholder="Username or Email"
          name="identifier"
          required
          value={user.identifier}
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
        <button className="login-btn" type="submit">Login</button>
      </form>
      <div className="switch">
            <h5>Don't have an account?</h5>
            <NavLink to="/register" >Register</NavLink>
          </div>
      </div> 
      </div> 
    </section>
  );
};

export default Login;
