import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Card, Button, Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FavoriteView = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {

        actions.fetchFavorites();

    }, []);

    const dishFavorites = store.favorites.filter(fav => fav.dish);
    const restaurantFavorites = store.favorites.filter(fav => fav.restaurant);

    return (
        <Container className="mt-4">
            <h2 className="d-flex justify-content-center mb-4">Mis Favoritos</h2>

            {store.favorites.length === 0 ? (
                <p>No tienes favoritos aún.</p>
            ) : (
                <Tabs defaultActiveKey="restaurants" id="favorites-tabs" className="mb-3" fill>
                    <Tab eventKey="restaurants" title="Restaurantes Favoritos">
                        <Row className="d-flex flex-wrap justify-content-around">
                            {restaurantFavorites.length > 0 ? (
                                restaurantFavorites.map(fav => (
                                    <Col key={fav.id} md={4} className="mb-4">
                                        <Card>
                                            <Card.Img
                                                variant="top"
                                                src={fav.restaurant.image || "https://via.placeholder.com/300x200?text=Restaurante"}
                                                alt={fav.restaurant.name}
                                            />
                                            <Card.Body>
                                                <Card.Title>{fav.restaurant.name}</Card.Title>
                                                <Card.Text>{fav.restaurant.description}</Card.Text>
                                                <div className="d-flex justify-content-between">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => navigate(`/menu/${fav.restaurant.restaurant_id}`)}
                                                    >
                                                        Ver Menú
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => actions.removeFavorite(fav.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes restaurantes favoritos.</p>
                            )}
                        </Row>
                    </Tab>

                    <Tab eventKey="dishes" title="Platillos Favoritos">
                        <Row className="d-flex flex-wrap justify-content-around">
                            {dishFavorites.length > 0 ? (
                                dishFavorites.map(fav => (
                                    <Col key={fav.id} md={4} className="mb-4">
                                        <Card style={{ width: "200px", height: "340px" }} className="m-2">
                                            <Card.Img
                                                variant="top"
                                                src={fav.dish.image || "https://via.placeholder.com/300x200?text=Platillo"}
                                                alt={fav.dish.name}
                                                style={{ width: '100%', height: '200px' }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{fav.dish.name}</Card.Title>
                                                <Card.Text>{fav.dish.description}</Card.Text>
                                                <Card.Text><strong>Precio:</strong> ${fav.dish.price}</Card.Text>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => actions.removeFavorite(fav.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </Card.Body>
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
    );
};

export default FavoriteView;
