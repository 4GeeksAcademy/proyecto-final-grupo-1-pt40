import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const GoogleMaps = ({ plusCode }) => {
    const [location, setLocation] = useState(null)
    const KEY= process.env.MAP_API
    const getLocation = async (plusCode) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${plusCode}&key=${KEY}`)
        const data = await response.json()
        console.log(data)
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            setLocation({ lat, lng })
        }
    }
    useEffect(() => {
        getLocation(plusCode)
    }, [plusCode])

    if (!location) {
        return (
            <div>Cargando mapa</div>
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