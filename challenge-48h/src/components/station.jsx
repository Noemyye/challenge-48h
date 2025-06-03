import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import List from './List.jsx';
import './station.css';
import open from "../assets/open.png";
import close from "../assets/close.png";


function StationInfo() {
    const { id } = useParams();
    const [station, setStation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://10.33.70.223:3000/api/stations/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Erreur lors du chargement de la station');
                return res.json();
            })
            .then((data) => setStation(data))
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <p>❌ Erreur : {error}</p>;
    if (!station) return <p>⏳ Chargement...</p>;

    const lon = station.coordinates.coordinates[0];
    const lat = station.coordinates.coordinates[1];

    return (
        <div className="layout">
            <div className="list-panel">
                <List/> {/* Ta liste de stations */}
            </div>

            <div className="info-panel">
                {station ? (
                    <>
                        <h1> <img
                            src={station.is_installed === true ? open : close}
                            alt={station.is_installed}
                        /> {station.name[0]?.text || id}</h1>
                        <div className="station-content">
                            {/* Colonne gauche : Informations générales */}
                            <div className="station-column left-column">
                                <h3>📄 Informations générales</h3>
                                <div className="info-container">
                                    <p>Station ID : {station.station_id}</p>
                                </div>
                                <div className="info-container">
                                    <p>Capacité totale : {station.capacity} places</p>
                                </div>
                                <div className="info-container">
                                    <p>Adresse : {station.address}</p>
                                </div>
                                <div className="info-container">
                                    <p>Code postal : {station.post_code}</p>
                                </div>
                                <div className="info-container">
                                    <p>Coordonnées : {lat}, {lon}</p>
                                </div>
                                <div className="info-container">
                                    <a
                                        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Voir sur OpenStreetMap
                                    </a>
                                </div>
                                <div className="info-container">
                                    <p>Dernière mise à jour : {station.updatedAt}</p>
                                </div>

                            </div>

                            {/* Colonne centre : Données en temps réel */}
                            <div className="station-column center-column">
                                <h3>📊 Disponibilité en temps réel</h3>
                                <div className="stats-row">
                                    <div className="stat-box green">
                                        <strong>{station.num_vehicles_available}</strong>
                                        <span>Vélos disponibles</span>
                                    </div>
                                    <div className="stat-box blue">
                                        <strong>{station.num_docks_available}</strong>
                                        <span>Places disponibles</span>
                                    </div>
                                    <div className="stat-box pink">
                                        <strong>{station.capacity}</strong>
                                        <span>Capacité totale</span>
                                    </div>
                                </div>
                            </div>


                            {/* Colonne droite : Avis */}
                            <div className="station-column right-column">
                                <h3>✍️ avis sur cette station</h3>
                                <textarea placeholder="Laisser un avis...." disabled/>
                                <div className="user-review">
                                    <strong>Toto :</strong>
                                    <p>Magnifique station vélo !</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : error ? (
                    <p>❌ Erreur : {error}</p>
                ) : (
                    <p>⏳ Chargement...</p>
                )}
            </div>
        </div>

    );
}

export default StationInfo;
