import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import image from './image2.png'; 
const Login = () => {  // No onLogin prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receptionist'); // Default to 'receptionist'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Redirect based on the role
    if (role === 'receptionist') {
      navigate('/receptionist');  // Redirect to ReceptionistDashboard
    } else if (role === 'doctor') {
      navigate('/doctor');  // Redirect to DoctorDashboard
    }
  };

  return (
    <div className="login-background">
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-header">
            <div className="login-icon">
              <img src={image} alt="Login" className="login-image" />
            </div>
          </div>
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="role-selection">
              <label>
                <input 
                  type="radio" 
                  value="receptionist" 
                  checked={role === 'receptionist'} 
                  onChange={() => setRole('receptionist')} 
                />
                Receptionist
              </label>
              <label>
                <input 
                  type="radio" 
                  value="doctor" 
                  checked={role === 'doctor'} 
                  onChange={() => setRole('doctor')} 
                />
                Doctor
              </label>
            </div>
            <input 
              type="email" 
              id="email" 
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="login-input"
            />
            <input 
              type="password" 
              id="password" 
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="login-input"
            />
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
              <a href="/." className="forgot-password">Forgot Password?</a>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
