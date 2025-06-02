import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

    return (
        <div style={{ padding: '1rem' }}>
            <h1>📍 Station {station.name[0]?.text || id}</h1>
            <p><strong>Adresse :</strong> {station.address}</p>
            <p><strong>Code postal :</strong> {station.post_code}</p>
            <p><strong>Capacité :</strong> {station.capacity}</p>
            <p><strong>Docks disponibles :</strong> {station.num_docks_available}</p>
            <p><strong>Vélos disponibles :</strong> {station.num_vehicles_available}</p>

            <p><strong>Types de vélos :</strong></p>
            <ul>
                {station.vehicle_types_available.map((type) => (
                    <li key={type.vehicle_type_id}>
                        {type.vehicle_type_id} : {type.count}
                    </li>
                ))}
            </ul>

            <p><strong>Méthodes de paiement :</strong> {station.rental_methods.join(', ')}</p>
            <p><strong>Coordonnées GPS :</strong> [{station.coordinates.coordinates.join(', ')}]</p>
        </div>
    );
}

export default StationInfo;
