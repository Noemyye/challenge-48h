import React from 'react';
import './Login.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE

function Login() {
  return (
    <div className="container-right">
      <img src={logo} />
    </div>
  );
}

export default Login;