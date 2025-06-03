import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return emailRegex.test(value) ? '' : 'Email invalide';
      case 'password':
        return passwordRegex.test(value) ? '' : 'Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      // Proceed with login
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="container">
      <a href="/"><img src={logo} alt="Logo TBM" /></a>
      <div className="container-login">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
          <br />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
          <br />
          <button type="submit">Connexion</button>
        </form>
        <div className="navigation-buttons">
          <Link to="/register" className="nav-button">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;