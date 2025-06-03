import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import List from './List.jsx';
import './station.css';


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
                        <h1>📍 {station.name[0]?.text || id}</h1>
                        <div className="station-content">
                            {/* Colonne gauche : Informations générales */}
                            <div className="station-column left-column">
                                <h3>📄 Informations générales</h3>
                                <p>Station ID : {station.station_id}</p>
                                <p>Capacité totale : {station.capacity} places</p>
                                <p>Adresse : {station.address}</p>
                                <p>Code postal : {station.post_code}</p>
                                <p>Coordonnées : {lat}, {lon}</p>
                                <a
                                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Voir sur OpenStreetMap
                                </a>
                                <p>Dernière mise à jour : {station.updatedAt}</p>
                            </div>

                            {/* Colonne centre : Données en temps réel */}
                            <div className="station-column center-column">
                                <h3>📊 Disponibilité en temps réel</h3>
                                <div className="stat-box green">
                                    <strong>{station.num_vehicles_available}</strong>
                                    <br/>
                                    <span>Vélos disponibles</span>
                                </div>
                                <div className="stat-box blue">
                                    <strong>{station.num_docks_available}</strong>
                                    <br/>
                                    <span>Places disponibles</span>
                                </div>
                                <div className="stat-box pink">
                                    <strong>{station.capacity}</strong>
                                    <br/>
                                    <span>Capacité totale</span>
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
