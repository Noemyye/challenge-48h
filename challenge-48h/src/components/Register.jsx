import React, { useState } from 'react';
import './Register.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return emailRegex.test(value) ? '' : 'Email invalide';
      case 'password':
        return passwordRegex.test(value) ? '' : 'Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Les mots de passe ne correspondent pas';
      case 'phone':
        return phoneRegex.test(value) ? '' : 'Numéro de téléphone invalide (format français)';
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
      // Proceed with registration
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="container-register">
      <a href="/"><img src={logo} alt="Logo TBM" /></a>
      <div className="container-login-register">
        <h1>S'inscrire</h1>
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmation du mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          <br />
          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
          <br />
          <button type="submit">S'inscrire</button>
        </form>
        <div className="navigation-buttons">
          <Link to="/login" className="nav-button">Déjà inscrit ? Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;