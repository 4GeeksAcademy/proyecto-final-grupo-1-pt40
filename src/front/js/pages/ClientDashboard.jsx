import React, { useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Context } from "../store/appContext";
import ClientNavbar from "../component/ClientNavbar.jsx";
import RestaurantCard from "../component/RestaurantCard.jsx";

const ClientDashboard = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getRestaurants();
  }, []);

  return (
    <div>
      <ClientNavbar />
      <Container fluid className="m-2 mt-4">
        <h2>Opciones de Restaurante</h2>
        <Row className="w-100 h-100">
          {Array.isArray(store.restaurants) && store.restaurants.length > 0 ? (
            store.restaurants.map((restaurant) => (
              <Col key={restaurant.restaurant_id}>
                <RestaurantCard data={restaurant} />
              </Col>
            ))
          ) : (
            <p>No hay restaurantes disponibles.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ClientDashboard;
