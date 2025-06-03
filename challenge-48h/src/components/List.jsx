import React, { useEffect, useState } from 'react';
import './List.css';
import logo from '../assets/Logo_TBM.png';
import search from '../assets/Search.png';
import open from '../assets/open.png';
import { Link } from 'react-router-dom';
import close from '../assets/close.png';

function List() {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://10.33.70.223:3000/api/stations`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des stations');
        return res.json();
      })
      .then((data) => setStations(data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredStations = stations.filter((station) =>
    station.name[0]?.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container-main'>
      <div className="container-right">
        <img src={logo} alt="Logo TBM" />
        
        <div className="container-list">
          <p>Liste des stations</p>
          
          <div className="search">
            <img src={search} alt="Recherche" />
            <input
              placeholder='Rechercher...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <ul className="station-list">
            {filteredStations.map((station, index) => (
              <Link to={`/station/${station._id}`} key={station._id || index} className="station-link">
                <li className='station'>
                  <img
                    src={station.is_installed === true ? open : close}
                    alt={station.is_installed}
                  />
                  {station.name[0]?.text || 'Nom inconnu'}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <div className='header'>
        <div className="header-buttons">
          <a className='boutonHeader'>Accueil</a>
          <a className='boutonHeader'>Station</a>
          <a className='boutonHeader'>Boutique</a>
          <a className='boutonHeader'>Connexion</a>
        </div>
        <img src='https://carto-maas.infotbm.com/assets/images/places/vcub.svg' className="header-logo" />
      </div>
    </div>
  );
}

export default List;
