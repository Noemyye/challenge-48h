import React from 'react';
import './Register.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE

function Register() {
  return (
    <div className="container-register">
      <a href="/"><img src={logo} /></a>
      <div className="container-login-register">
        <h1>S'inscrire</h1>
        <form>
          <input type="text" placeholder="Email" /><br />
          <input type="password" placeholder="Mot de passe" /><br />
          <input type="password" placeholder="Confirmation du mot de passe" /><br />
          <input type="text" placeholder="Téléphone" /><br />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}

export default Register;