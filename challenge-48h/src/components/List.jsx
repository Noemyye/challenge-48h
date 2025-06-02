import React from 'react';
import './List.css';
import logo from '../assets/Logo_TBM.png'; // ← l'import est OBLIGATOIRE

function List() {
  return (
    <div className="container-right">
      <img 
        src={logo}
      />
      <div className="container-list">
      </div>
    </div>
  );
}

export default List;
