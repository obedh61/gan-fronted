import React from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

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


