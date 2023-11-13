import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import carIconUrl from '../../assets/car-marker2.png';

const customMarker = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41],
});

const customCarMarker = new L.Icon({
    iconUrl: carIconUrl,
    iconRetinaUrl: carIconUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    tooltipAnchor: [16, -28],
    shadowUrl: null,
    shadowSize: null,
});

const MapUsersLocationView = () => {
    const center = [52.0692, 19.4807]; // Współrzędne na środku Polski
    const mapRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(875);
    const [markers, setMarkers] = useState([
        { id: 1, position: [52.0692, 19.4807], email: 'user1@example.com' },
        { id: 2, position: [51.566827, 16.241078], email: 'user2@example.com' },
        { id: 3, position: [50.180416, 22.001673], email: 'user3@example.com' },
        { id: 4, position: [53.725967, 22.419426], email: 'user4@example.com' },
    ]);

    const circleMarkers = [
        { id: 5, center: [53.334153, 21.207917], radius: 200000, color: 'red', name: 'Strefa 1' },
        { id: 6, center: [50.781629, 21.559709], radius: 200000, color: 'blue', name: 'Strefa 2' },
        { id: 7, center: [51.141448, 17.096922], radius: 200000, color: 'green', name: 'Strefa 3' },
        { id: 8, center: [53.5, 16.7], radius: 200000, color: 'orange', name: 'Strefa 4' },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (mapRef.current) {
                const newHeight = mapRef.current.clientHeight - 200;
                setContainerHeight(newHeight);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMarkerDrag = (id, newPosition) => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker) => (marker.id === id ? { ...marker, position: newPosition } : marker))
        );
    };

    return (
        <div style={{ height: containerHeight, width: '100%' }}>
            <MapContainer ref={mapRef} center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='' />
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        draggable={true}
                        onDragEnd={(e) => handleMarkerDrag(marker.id, e.target.getLatLng())}
                        icon={customCarMarker}
                    >
                        <Popup>{marker.email}</Popup>
                    </Marker>
                ))}
                {circleMarkers.map((circleMarker) => (
                    <Circle
                        key={circleMarker.id}
                        center={circleMarker.center}
                        radius={circleMarker.radius}
                        color={circleMarker.color}
                    >
                        <Popup>{circleMarker.name}</Popup>
                    </Circle>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapUsersLocationView;
