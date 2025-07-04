import React, { useState, useContext } from "react";
import "../styles/LoginRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const userId = await login(email, password);

    if (userId) {
        navigate(`/meet/${userId}`);
    } else {
        alert("Invalid credentials. Please try again.");
    }
};




  return (
    <div className="formContainer">
      <div className="smart-header">
        <div className="smart-logo">
          <h2>
            <Link id="smart-logo-h2" to={"/"}>
              Smart Meet
            </Link>
          </h2>
        </div>
      </div>

      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p>
          Not registered? <Link to={"/register"}>Register now!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
