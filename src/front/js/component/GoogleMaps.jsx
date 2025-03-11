import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const GoogleMaps = ({ address }) => {
    const [location, setLocation] = useState(null)
    const KEY = process.env.MAP_API

    const parseAddress = (address) => {
        const url = new URL(address);
        const placeIdMatch = url.href.match(/!3d([^!]+)!4d([^!]+)/);
        if (placeIdMatch) {
            const [_, lat, lng] = placeIdMatch;
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
        } else {
            return null;
        }
    }

    useEffect(() => {
        const coordinates = parseAddress(address)
        setLocation(coordinates)
    }, [address])

    if (!location) {
        return (
            <div>Cargando mapa...</div>
        )
    }
    return (
        <LoadScript googleMapsApiKey={KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15} mapId={'9b9f62a2055159bc'}>
                <Marker position={location} />
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMaps