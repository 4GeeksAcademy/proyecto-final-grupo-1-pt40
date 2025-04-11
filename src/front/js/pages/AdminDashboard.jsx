import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Tabs, Tab, Table } from "react-bootstrap";
import { Context } from "../store/appContext";
import NotificationModal from "../component/NotificationModal.jsx";
import AdminNavbar from "../component/AdminNavbar.jsx";
import '../../styles/index.css';
import { showIncompleteFieldsError, showDeleteError } from "../store/utils.js"

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
        showDeleteError('cliente')
      }

    } else if (type === 'restaurant') {
      const response = await actions.deleteRestaurant(id)
      if (!response) {
        showDeleteError('restaurante')
      }
    }

  }

  const handleQuery = async () => {
    if (query) {
      actions.filterRestaurants(query)
      setsearchOn(true)
    } else {
      showIncompleteFieldsError()
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
    <>
      <AdminNavbar />
      <Container fluid style={{ backgroundColor: '#ECECEC', minHeight: '100vh' }}>
        <Row>
          <Tabs
            defaultActiveKey="restaurants"
            id="fill-tab-example"
            className="login-tabs mb-3"
            fill
          >
            <Tab eventKey="restaurants" className="login-tab" title="Restaurantes">

              <Row className="my-4 align-items-end">
                <Col lg='6'>
                  <Form className="form-1">
                    <Form.Label>Buscar por Email o Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={searchOn}
                    />
                  </Form>
                </Col>
                <Col lg='3' className="d-flex gap-2 mt-3 mt-lg-0">
                  <Button className="primary1" onClick={handleQuery}>Buscar</Button>
                  <Button className="danger1" onClick={resetQuery}>Volver a Buscar</Button>
                </Col>
              </Row>

              {store.restaurants.length > 0 ? (<Table className="mt-3 table-1" striped>
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
                          <Button className="danger1" onClick={() => handleDelete('restaurant', res.restaurant_id)}>Eliminar</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                  }

                </tbody>
              </Table>

              ) : (<div>No hay restaurantes en estos momentos</div>)}

            </Tab>
            <Tab eventKey="client" className="login-tab" title="Clientes">
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
                      <td><Button className="danger1" onClick={() => handleDelete('client', client.client_id)}>Eliminar</Button></td>
                    </tr>
                  ))
                  }
                </tbody>
              </Table>
              ) : (<div>No hay clientes en estos momentos</div>)}
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>);
};

export default AdminDashboard;