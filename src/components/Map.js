import L from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

// Crear un ícono personalizado
const customIcon = new L.Icon({
    iconUrl: 'path/to/your/icon.png', // Reemplaza con la URL de tu ícono
    iconSize: [25, 41], // Ancho y alto del ícono
    iconAnchor: [12, 41], // Puntos de anclaje
    });

    const Map = ({ latitude, longitude }) => {
    const position = [latitude, longitude];

    return (
        <MapContainer
            center={position}
            zoom={16}
            style={{ height: "200px", width: "100%" }}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* <Marker position={position} /> */}
            {/* <Marker position={position}>
                <Popup>
                Tu ubicación: {latitude}, {longitude}
                </Popup>
            </Marker> */}
            <Circle
                center={position}
                radius={100} // En metros
                color="blue"
            />
        </MapContainer>
    );
};

export default Map;


