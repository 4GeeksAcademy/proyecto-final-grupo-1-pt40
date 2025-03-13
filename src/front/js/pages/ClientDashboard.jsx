import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import FavoritePage from "./FavoritePage.jsx";
import ExplorePage from "./ExplorePage.jsx";
import { Navbar, Nav, Container } from "react-bootstrap";
import {  Card, Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FavoriteButton from "../component/FavoriteButton.jsx"
import ClientProfile from "./ClientProfile.jsx";

import ClientNavbar from "../component/ClientNavbar.jsx";


import RestaurantCard from "../component/RestaurantCard.jsx";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("restaurants");
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getRestaurants();
    }, []);

    
    const renderContent = () => {
        switch (activeMenu) {
            case "perfil":
                return <ClientProfile />;

            case "favoritos":
                return <FavoritePage />;

            case "ayuda":
                return (
                    <div>
                        <h2>Ayuda</h2>
                        <p>¿Necesitas asistencia? Consulta nuestras preguntas frecuentes o contáctanos.</p>
                    </div>
                );
            case "explore":
                return <ExplorePage />

            default:
                
                return (
                    <Container fluid className="m-2">
                        <h2>Opciones de Restaurante</h2>
                        <Row className="w-100 h-100">
                        {Array.isArray(store.restaurants) && store.restaurants.length > 0 ? (
                            store.restaurants.map((restaurant) => (
                                <Col key={restaurant.restaurant_id}>
                                    <RestaurantCard data={restaurant}/>
                                </Col>
                            ))
                        ) : (
                            <p>No hay restaurantes disponibles.</p>
                        )}
                        </Row>
                    </Container>
    
                );
        }
    };

    return (
        <div>
            <ClientNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <Container className="mt-4">{renderContent()}</Container>
        </div>
    );
};

export default ClientDashboard;

