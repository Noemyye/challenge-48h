import React from 'react';
import './Login.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE

function Login() {
  return (
    <div className="container">
      <img src={logo} />
      <div className="container-login">
        <h1>Connexion</h1>
        <form>
          <input type="text" placeholder="Email" /><br />
          <input type="password" placeholder="Mot de passe" /><br />
          <button type="submit">Connexion</button>
        </form>
        <p>Pas encore inscrit ? <a href="/register">S'inscrire</a></p>
      </div>
    </div>
  );
}

export default Login;