import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Card, Button, Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../component/ClientNavbar.jsx";

const FavoriteView = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.fetchFavorites();
    }, []);

    const handleMenuClick = async (username) => {
        const response = await actions.getRestaurantMenusPublic(username);
        if (response && Array.isArray(response) && response.length > 0) {
            navigate(`/restaurant/${username}/menu/${response[0].menu_id}`);
        } else {
            alert("El restaurante no tiene menús disponibles o no está activo.");
        }
    };

    const favorites = Array.isArray(store.favorites) ? store.favorites : [];
    const dishFavorites = favorites.filter(fav => fav.dish);
    const restaurantFavorites = favorites.filter(fav => fav.restaurant);

    return (
        <div>
            <ClientNavbar />
            <Container className="mt-4">
                <h2 className="d-flex justify-content-center mb-4 fw-bold text-orange">Mis Favoritos</h2>

                {favorites.length === 0 ? (
                    <p>No tienes favoritos aún.</p>
                ) : (
                    <Tabs defaultActiveKey="restaurants" id="favorites-tabs" className="mb-3 favorite-tabs" fill>
                        <Tab eventKey="restaurants" title="Restaurantes Favoritos" className="favorite-tab-content">
                            <Row className="justify-content-center g-4">
                                {restaurantFavorites.length > 0 ? (
                                    restaurantFavorites.map(fav => (
                                        <Col key={fav.id} xs={12} sm={6} md={6} lg={4} xl={3} className="d-flex justify-content-center">
                                            <Card style={{ width: "16rem", height: "23rem" }} className="restaurant-card">
                                                <Card.Img
                                                    variant="top"
                                                    src={fav.restaurant.image || "https://via.placeholder.com/300x200?text=Restaurante"}
                                                    alt={fav.restaurant.name}
                                                    style={{ height: "180px", objectFit: "cover" }}
                                                />
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="text-truncate">{fav.restaurant.name}</Card.Title>
                                                    <Card.Text
                                                        className="flex-grow-1"
                                                        style={{
                                                            maxHeight: "80px",
                                                            overflowY: "auto",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            lineHeight: "1.3em",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                    >
                                                        {fav.restaurant.description || "Sin descripción"}
                                                    </Card.Text>
                                                </Card.Body>

                                                <div className="card-footer d-flex justify-content-between">
                                                    <Button
                                                        className="menu-button"
                                                        onClick={() => handleMenuClick(fav.restaurant.username)}
                                                    >
                                                        Ver Menú
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => actions.removeFavorite(fav.id)}
                                                        size="sm"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <p>No tienes restaurantes favoritos.</p>
                                )}
                            </Row>
                        </Tab>

                        <Tab eventKey="dishes" title="Platillos Favoritos" className="favorite-tab-content">
                            <Row className="justify-content-center g-4">
                                {dishFavorites.length > 0 ? (
                                    dishFavorites.map(fav => (
                                        <Col key={fav.id} xs={12} sm={6} md={6} lg={4} xl={3} className="d-flex justify-content-center">
                                            <Card style={{ width: "16rem", height: "23rem" }} className="restaurant-card">
                                                <Card.Img
                                                    variant="top"
                                                    src={fav.dish.image || "https://via.placeholder.com/300x200?text=Platillo"}
                                                    alt={fav.dish.name}
                                                    style={{ height: "180px", objectFit: "cover" }}
                                                />
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="text-truncate">{fav.dish.name}</Card.Title>
                                                    <Card.Text
                                                        style={{
                                                            maxHeight: "60px",
                                                            overflowY: "auto",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            lineHeight: "1.3em",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                    >
                                                        {fav.dish.description || "Sin descripción"}
                                                    </Card.Text>
                                                    <Card.Text><strong>Precio:</strong> ${fav.dish.price}</Card.Text>
                                                </Card.Body>

                                                <div className="card-footer text-center">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => actions.removeFavorite(fav.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <p>No tienes platillos favoritos.</p>
                                )}
                            </Row>
                        </Tab>
                    </Tabs>
                )}
            </Container>
        </div>

    );
};

export default FavoriteView;