import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import List from './List.jsx';
import './station.css';
import open from "../assets/open.png";
import close from "../assets/close.png";

function StationInfo() {
    const { id } = useParams();

    const [station, setStation] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [comment, setComment] = useState('');
    const [note, setNote] = useState(5);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    // Charger la station
    useEffect(() => {
        fetch(`http://10.33.70.223:3000/api/stations/${id}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) throw new Error('Erreur lors du chargement de la station');
                return res.json();
            })
            .then(data => setStation(data))
            .catch(err => setError(err.message));
    }, [id]);

    // Charger les avis
    const fetchRatings = () => {
        const url = `http://10.33.70.223:3000/api/ratings/station/${id}`;
        console.log('Appel API ratings:', url);
        fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include' // si API utilise les cookies de session
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors du chargement des avis");
                return res.json();
            })
            .then(data => setRatings(Array.isArray(data) ? data : (data.ratings || [])))
            .catch(err => console.error("Erreur avis :", err));
    };

    useEffect(() => {
        fetchRatings();
    }, [id]);

    // Soumettre un avis
    const submitRating = () => {
        if (!comment.trim()) return;

        setIsSending(true);

        fetch('http://10.33.70.223:3000/api/ratings/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                stationId: id,
                rating: note,
                comment
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Erreur lors de l\'envoi');
                return res.json();
            })
            .then(() => {
                setComment('');
                fetchRatings(); // Recharge les avis
            })
            .catch(err => {
                alert('Erreur: ' + err.message);
            })
            .finally(() => setIsSending(false));
    };

    if (error) return <p>❌ Erreur : {error}</p>;
    if (!station) return <p>⏳ Chargement...</p>;

    const lon = station.coordinates.coordinates[0];
    const lat = station.coordinates.coordinates[1];

    return (
        <div className="layout">
            <div className="list-panel">
                <List />
            </div>

            <div className="info-panel">
                <div className="station-card">
                    <h1>
                        <img src={station.is_installed === true ? open : close} alt={station.is_installed ? "ouverte" : "fermée"} />{" "}
                        {station.name[0]?.text || id}
                    </h1>
                    <div className="station-content">
                        {/* Colonne gauche */}
                        <div className="station-column left-column">
                            <h3>📄 Informations générales</h3>
                            <div className="info-container"><p>Station ID : {station.station_id}</p></div>
                            <div className="info-container"><p>Capacité totale : {station.capacity} places</p></div>
                            <div className="info-container"><p>Adresse : {station.address}</p></div>
                            <div className="info-container"><p>Code postal : {station.post_code}</p></div>
                            <div className="info-container"><p>Coordonnées : {lat}, {lon}</p></div>
                            <div className="info-container">
                                <a
                                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Voir sur OpenStreetMap
                                </a>
                            </div>
                            <div className="info-container"><p>Dernière mise à jour : {station.updatedAt}</p></div>
                        </div>
                        {/* Colonne centre */}
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
                            <div className="station-services">
                                <h3 style={{textAlign: 'center', fontWeight: 500, marginBottom: '1rem'}}>
                                    <span role="img" aria-label="vélo">🚲</span> Véhicules et Services
                                </h3>
                                <div className="station-pill">
                                    Types de vélos:&nbsp;
                                    Classiques: {station.vehicle_types_available?.find(v => v.vehicle_type_id === 'classic')?.count ?? 0},
                                    &nbsp;Électriques: {station.vehicle_types_available?.find(v => v.vehicle_type_id === 'electric')?.count ?? 0}
                                </div>
                                <div className="station-pill">
                                    Moyens de paiement:&nbsp;
                                    {station.rental_methods?.length
                                        ? station.rental_methods.map((m, i) => (
                                            <span key={m}>
                                                {m === 'creditcard' ? 'Carte bancaire' : m === 'phone' ? 'Téléphone' : m.charAt(0).toUpperCase() + m.slice(1)}
                                                {i < station.rental_methods.length - 1 ? ', ' : ''}
                                            </span>
                                        ))
                                        : 'Non renseigné'}
                                </div>
                            </div>
                        </div>
                        {/* Colonne droite */}
                        <div className="station-column right-column">
                            <h3>✍️ Avis sur cette station</h3>
                            <label>Note :</label>
                            <select value={note} onChange={(e) => setNote(parseInt(e.target.value))}>
                                <option value={1}>1 ⭐</option>
                                <option value={2}>2 ⭐⭐</option>
                                <option value={3}>3 ⭐⭐⭐</option>
                                <option value={4}>4 ⭐⭐⭐⭐</option>
                                <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                            </select>
                            <textarea
                                placeholder="Laisser un avis..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isSending}
                            />
                            <button onClick={submitRating} disabled={isSending || !comment.trim()}>
                                Publier
                            </button>
                            {(() => {
                                const validRatings = ratings.filter(r => r && r.comment && r.comment.trim() !== '');
                                return validRatings.length === 0 ? (
                                    <p style={{ opacity: 0.6 }}>Aucun avis pour cette station.</p>
                                ) : (
                                    validRatings.map((rating, index) => (
                                        <div className="user-review" key={index}>
                                            <strong>{rating.rating.name ?? 'Utilisateur inconnu'} :</strong>
                                            <p>{rating.rating} ⭐ — {rating.comment}</p>
                                        </div>
                                    ))
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StationInfo;
