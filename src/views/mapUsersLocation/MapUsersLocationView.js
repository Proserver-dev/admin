import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import carIconUrl from '../../assets/car-marker2.png';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import {useTranslation} from "react-i18next";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import SocketEvents from "../../constants/SocketEvents";
import {setSnackBar} from "../../redux/actions";

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

const markersDefault = [
    { user: { id: 1, email: 'test@test.pl' }, latitude: 52.0692, longitude: 19.4807 },
    { user: { id: 2, email: 'test2@test.pl' }, latitude: 51.566827, longitude: 16.241078 },
    { user: { id: 3, email: 'test3@test.pl' }, latitude: 50.180416, longitude: 22.001673 },
    { user: { id: 4, email: 'test4@test.pl' }, latitude: 53.725967, longitude: 22.419426 },
]

const circleMarkersDefault = [
    { id: 5, center: [53.334153, 21.207917], radius: 200000, color: 'red', name: 'Strefa 1' },
    { id: 6, center: [50.781629, 21.559709], radius: 200000, color: 'blue', name: 'Strefa 2' },
    { id: 7, center: [51.141448, 17.096922], radius: 200000, color: 'green', name: 'Strefa 3' },
    { id: 8, center: [53.5, 16.7], radius: 200000, color: 'orange', name: 'Strefa 4' },
]

const MapUsersLocationView = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket);
    const center = [52.0692, 19.4807]; // Współrzędne na środku Polski
    const mapRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(825);
    const [markers, setMarkers] = useState([]);
    const [circleMarkers, setCircleMarkers] = useState(circleMarkersDefault);

    useEffect(() => {
        if (socket) {
            socket.on(SocketEvents.LISTEN_CHANGE_LOCATION, (data) => {
                setMarkers((prevState) => {
                    // Sprawdź, czy istnieje marker z danym user.id
                    const existingMarkerIndex = prevState.findIndex((marker) => marker.user.id === data.user.id);

                    if (existingMarkerIndex !== -1) {
                        // Aktualizuj istniejący marker, jeśli istnieje
                        const updatedMarkers = [...prevState];
                        updatedMarkers[existingMarkerIndex] = { ...prevState[existingMarkerIndex], latitude: data.latitude, longitude: data.longitude };
                        return updatedMarkers;
                    } else {
                        // Dodaj nowy marker, jeśli nie istnieje
                        return [...prevState, { user: data.user, latitude: data.latitude, longitude: data.longitude }];
                    }
                });
            });
        }
    }, [socket]);

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

    const handleShowZones = () => {
        setCircleMarkers(circleMarkersDefault)
    }

    const handleHideZones = () => {
        setCircleMarkers([])
    }

    const handleMarkerDrag = (id, newPosition) => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker) => (marker.id === id ? { ...marker, position: newPosition } : marker))
        );
    };

    const actionsSpeedDial = [
        { icon: <ShowIcon />, name: 'Pokaż strefy', onClick: handleShowZones },
        { icon: <HideIcon />, name: 'Ukryj strefy', onClick: handleHideZones },
    ];

    return (
        <div style={{ height: containerHeight, width: '100%', marginTop: '40px' }}>
            <MapContainer ref={mapRef} center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='' />
                {markers.map((marker) => (
                    <Marker
                        key={marker?.user?.id}
                        position={[marker?.latitude, marker?.longitude]}
                        draggable={true}
                        onDragEnd={(e) => handleMarkerDrag(marker?.user.id, e.target.getLatLng())}
                        icon={customCarMarker}
                    >
                        <Popup>{marker?.user?.email}</Popup>
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
            <SpeedDial
                ariaLabel="Map menu"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actionsSpeedDial.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.onClick}
                    />
                ))}
            </SpeedDial>
        </div>
    );
};

export default MapUsersLocationView;
