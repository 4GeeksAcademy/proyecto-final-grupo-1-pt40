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
        <h2 className="mb-4 mx-2 fw-bold text-orange">Opciones de Restaurante</h2>
        <Row className="justify-content-center g-4">
          {Array.isArray(store.restaurants) && store.restaurants.length > 0 ? (
            store.restaurants.map((restaurant) => (
              <Col
                key={restaurant.restaurant_id}
                xs={12} sm={6} md={6} lg={4} xl={3}
                className="d-flex justify-content-center"
              >
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
