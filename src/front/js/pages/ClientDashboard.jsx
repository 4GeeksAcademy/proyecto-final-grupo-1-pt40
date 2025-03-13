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
            
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>El punto</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={() => setActiveMenu("restaurants")} active={activeMenu === "restaurants"}>
                            Restaurantes
                        </Nav.Link>
                        <Nav.Link onClick={() => setActiveMenu("explore")} active={activeMenu === "explore"}>
                            Explora
                        </Nav.Link>
                        <Nav.Link onClick={() => setActiveMenu("perfil")} active={activeMenu === "perfil"}>
                            Perfil
                        </Nav.Link>
                        <Nav.Link onClick={() => setActiveMenu("favoritos")} active={activeMenu === "favoritos"}>
                            Favoritos
                        </Nav.Link>
                        <Nav.Link onClick={() => setActiveMenu("ayuda")} active={activeMenu === "ayuda"}>
                            Ayuda
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="mt-4">{renderContent()}</Container>
        </div>
    );
};

export default ClientDashboard;

