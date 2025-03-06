import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const FavoriteView = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.client?.id) {
            actions.fetchFavorites();
        }
    }, [store.client]);

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Mis Favoritos</h2>
            {store.favorites.length === 0 ? (
                <p>No tienes favoritos aún.</p>
            ) : (
                <Row>
                    {store.favorites.map((fav) => {
                        const dish = store.dishes.find((d) => d.id === fav.dish_id);
                        return (
                            <Col key={fav.id || fav.dish_id ||  fav.restaurant_id} md={4} className="mb-4">
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        src="https://via.placeholder.com/300x200?text=Platillo"
                                        alt={dish ? dish.name : "Platillo desconocido"}
                                    />
                                    <Card.Body>
                                        <Card.Title>{dish ? dish.name : "Platillo desconocido"}</Card.Title>
                                        <Button
                                            variant="danger"
                                            onClick={() => actions.removeFavorite(fav.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default FavoriteView;
