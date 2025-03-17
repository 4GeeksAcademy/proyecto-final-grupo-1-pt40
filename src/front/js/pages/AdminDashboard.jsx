import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Tabs, Tab, Table } from "react-bootstrap";
import { Context } from "../store/appContext";
import NotificationModal from "../component/NotificationModal.jsx";

const AdminDashboard = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState('')
  const [searchOn, setsearchOn] = useState(false)
  const onLoad = async () => {
    const response = await actions.loadAdminData()
  }

  const handleDelete = async (type, id) => {
    if (type === 'client') {
      const response = await actions.deleteClient(id)
      if (!response) {
        alert('Error eliminando cliente')
      }

    } else if (type === 'restaurant') {
      const response = await actions.deleteRestaurant(id)
      if (!response) {
        alert('Error eliminando restaurante')
      }
    }

  }

  const handleQuery = async () => {
    if (query) {
      actions.filterRestaurants(query)
      setsearchOn(true)
    } else {
      alert('Debes escribir un email or username')
    }
  }

  const resetQuery = async () => {
    setQuery('')
    setsearchOn(false)
    onLoad()
  }

  useEffect(() => {
    onLoad()
  }, [])
  return (
    <Container fluid>

      <Row>
        <Tabs
          defaultActiveKey="restaurants"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="restaurants" title="Restaurantes">

            <Row className="my-4">
              <Col lg='6' className="align-middle">
                <Form>
                  <Form.Label>Buscar por Email o Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={searchOn}
                  />
                </Form>
              </Col>
              <Col lg='3' className="align-bottom d-flex justify-content-around">
                <Button variant="primary" onClick={handleQuery}>Buscar</Button>
                <Button variant="danger" onClick={resetQuery}>Volver a Buscar</Button>
              </Col>
            </Row>

            {store.restaurants.length > 0 ? (<Table striped mt-3>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>

                {store.restaurants.map((res, index) => (
                  <tr key={res.restaurant_id}>
                    <td>{res.restaurant_id}</td>
                    <td>{res.name}</td>
                    <td>{res.username}</td>
                    <td>{res.email}</td>
                    <td>
                      <div className="justify-content-around d-flex">
                        <NotificationModal contact={res} />
                        <Button variant="danger" onClick={() => handleDelete('restaurant', res.restaurant_id)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))
                }

              </tbody>
            </Table>

            ) : (<div>No hay restaurantes en estos momentos</div>)}

          </Tab>
          <Tab eventKey="client" title="Clientes">
            {store.clients.length > 0 ? (<Table striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>

                {store.clients.map((client, index) => (
                  <tr key={client.client_id}>
                    <td>{client.client_id}</td>
                    <td>{client.username}</td>
                    <td>{client.email}</td>
                    <td><Button variant="danger" onClick={() => handleDelete('client', client.client_id)}>Eliminar</Button></td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
            ) : (<div>No hay clientes en estos momentos en estos momentos</div>)}
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
};

export default AdminDashboard;