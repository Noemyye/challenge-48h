import React, { useEffect, useState } from 'react';
import './List.css';
import logo from '../assets/Logo_TBM.png';
import search from '../assets/Search.png';
import open from '../assets/open.png';
import close from '../assets/close.png';


function List() {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredStations = stations.filter((station) =>
    station.name[0]?.text.toLowerCase().includes(searchTerm.toLowerCase())
  );  

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

  return (
    <div className='container'>
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

          <ul>
              <li className='station'>
                <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={close}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={close}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={open}/>
                Place Gambetta
              </li>
              <li className='station'>
              <img src={close}/>
                Place Gambetta
              </li>
          </ul>
        </div>
      </div>

      <div className='header'>
        <a className='boutonHeader'>
          Accueil
        </a>
        <a className='boutonHeader'>
          Station
        </a>
        <a className='boutonHeader'>
          Boutique
        </a>
        <a className='boutonHeader'>
          Connexion
        </a>
      </div>
    </div>
  );
}

export default List;

//{stations.map((station, index) => (   {error && <p className="error">{error}</p>}
  //<li key={station._id || index}>
  //{station.name[0]?.text || 'Nom inconnu'}
//</li>
//))}