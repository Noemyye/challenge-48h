import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import openIcon from '../assets/open.png';
import closeIcon from '../assets/close.png';
import { useNavigate } from 'react-router-dom';

function MapBordeaux() {
    const [map, setMap] = useState(null);
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize map
        const mapInstance = L.map('map').setView([44.837789, -0.57918], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);

        // Create custom icons with smaller size
        const openMarkerIcon = L.icon({
            iconUrl: openIcon,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
        });

        const closeMarkerIcon = L.icon({
            iconUrl: closeIcon,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
        });

        // Create hover icons (slightly larger)
        const openMarkerHoverIcon = L.icon({
            iconUrl: openIcon,
            iconSize: [25, 25],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });

        const closeMarkerHoverIcon = L.icon({
            iconUrl: closeIcon,
            iconSize: [25, 25],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });

        // Fetch stations data
        fetch('http://10.33.70.223:3000/api/stations')
            .then(res => res.json())
            .then(data => {
                setStations(data);
                // Add markers for each station
                data.forEach(station => {
                    const [lon, lat] = station.coordinates.coordinates;
                    const marker = L.marker([lat, lon], {
                        icon: station.is_installed ? openMarkerIcon : closeMarkerIcon
                    }).addTo(mapInstance);
                    
                    // Create popup content with clickable link
                    const popupContent = `
                        <div>
                            <h3>${station.name[0]?.text || 'Station'}</h3>
                            <p>Vélos disponibles: ${station.num_vehicles_available}</p>
                            <p>Places disponibles: ${station.num_docks_available}</p>
                            <p>Capacité totale: ${station.capacity}</p>
                            <p><a href="/station/${station._id}" style="color: #007bff; text-decoration: underline; cursor: pointer;">Voir les détails</a></p>
                        </div>
                    `;
                    
                    // Create a tooltip that shows on hover
                    const tooltipContent = `
                        <div style="font-size: 12px; padding: 5px;">
                            <strong>${station.name[0]?.text || 'Station'}</strong><br>
                            Vélos: ${station.num_vehicles_available}<br>
                            Places: ${station.num_docks_available}
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    marker.bindTooltip(tooltipContent, {
                        permanent: false,
                        direction: 'top',
                        className: 'custom-tooltip'
                    });

                    // Add hover effects
                    marker.on('mouseover', () => {
                        marker.setIcon(station.is_installed ? openMarkerHoverIcon : closeMarkerHoverIcon);
                    });

                    marker.on('mouseout', () => {
                        marker.setIcon(station.is_installed ? openMarkerIcon : closeMarkerIcon);
                    });

                    // Add click event to navigate to station page
                    marker.on('click', () => {
                        navigate(`/station/${station._id}`);
                    });
                });
            })
            .catch(error => console.error('Error fetching stations:', error));

        // Cleanup
        return () => {
            mapInstance.remove();
        };
    }, [navigate]);

    return (
        <div className="map-container">
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
}

export default MapBordeaux;
  