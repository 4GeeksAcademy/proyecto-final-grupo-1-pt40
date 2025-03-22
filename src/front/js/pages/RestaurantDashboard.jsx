import React, { useState, useEffect, useContext } from "react";
import { Button, Accordion, Alert, Modal, Form, Container, Row, Col, Stack } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import DeleteMenuModal from "../component/DeleteMenuModal.jsx"
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import "../../styles/restaurant-dashboard.css"

const RestaurantDashboard = () => {
    const { store, actions } = useContext(Context);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menuName, setMenuName] = useState("");
    const [currency, setCurrency] = useState("");

    const onLoad = async () => {
        if (await actions.getRestaurantMenus()) {
            console.log("Menús cargados correctamente.");
        } else {
            console.error("Error al cargar los menús.");
        }

        if (await actions.getRestaurantNews()) {
            console.log('Novedades cargadas correctamente')
            console.log(store.restaurantNews)
        } else {
            console.error("Error cargando novedades")
        }
    };

    const handleView = (id) => {
        navigate(`/menu/${id}`)
    }

    const handleMenuDetails = (id) => {
        navigate(`/menu-builder/${id}`)
    }

    const handlePublish = async (id) => {
        const response = await actions.publishMenu(id)
        if (response) {
            setAlert('Public')
            onLoad()
        }
    }

    const handleUnpublish = async (id) => {
        const response = await actions.unpublishMenu(id)
        if (response) {
            setAlert('Private')
            onLoad()
        }
    }
    const handleOpenEditModal = (menu) => {
        setSelectedMenu(menu);
        setMenuName(menu.name);
        setCurrency(menu.currency);
        setShowEditModal(true);
    };
    const handleUpdateMenu = async () => {
        if (selectedMenu) {
            await actions.updateMenu(selectedMenu.menu_id, { name: menuName, currency: currency });
            setShowEditModal(false);
        }
    };

    const handleDeleteNews = async (id) => {
        const response = await actions.deleteRestaurantNews(id)
        if (!response) {
            console.log('Error eliminando anuncio')
        }

    }

    const handleEditNews = async (data) => {
        const response = actions.editNewsRequest(data)
        if (response) navigate(`/restaurant-news`)
    }

    useEffect(() => {
        onLoad()
    }, [])

    return (
        <>
            <RestaurantNavbar />
            <Container fluid>

                {alert === 'Public' ? (<Alert key={1} variant='success'>
                    Menú publicado con éxito, se encuentra disponible para todo público
                </Alert>) : ''}


                {alert === 'Private' ? (<Alert key={2} variant='warning'>
                    Menú privatizado, no encuentra disponible para los clientes
                </Alert>) : ''}


                <h2 className="mb-4 mx-2 fw-bold text-orange">MENÚS</h2>
                <Row className="menu-list p-4 shadow rounded d-flex mx-2">
                    {Array.isArray(store.restaurantMenus) ? (
                        store.restaurantMenus.length > 0 ? (
                            <Accordion className="w-100">
                                {store.restaurantMenus.map((menu) => (
                                    <Accordion.Item eventKey={menu.menu_id} key={menu.menu_id}>
                                        <Accordion.Header className="custom-accordion-header"><div className="fw-bold text-bw fs-5">{`${menu.name} (ID: ${menu.menu_id})`}</div></Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col xs='12' md='6' lg='2' className="justify-content-start mb-2">
                                                    <div className="m-auto align-middle">
                                                        <div className="mb-1"><strong>Moneda: </strong> {`${menu.currency}`}</div>
                                                        <div><strong>Estatus: </strong> {`${menu.is_active ? "Público" : 'Privado'}`}</div>
                                                    </div>
                                                </Col>
                                                <Col xs='12' md='6' lg='4' className="justify-content-start align-middle mb-2">
                                                    <div className="m-auto align-middle">
                                                        <div className="mb-1"><strong>Creado: </strong>{menu.created}</div>
                                                        <div><strong>Actualizado: </strong> {menu.last_updated}</div>
                                                    </div>

                                                </Col>
                                                <Col xs='12' md='6' lg='3' className="text-center align-items-center mt-2 px-2">
                                                    <Stack direction="vertical" gap={2} className="m-auto justify-content-center align-middle flex-wrap" >
                                                        <Button variant="secondary" size='md' className='btn-responsive btn-small-text' onClick={() => handleView(menu.menu_id)}>Ver Menú</Button>
                                                        <Button variant="info" size='md' className='btn-responsive btn-small-text' onClick={() => handleOpenEditModal(menu)}>Cambiar Nombre/Moneda</Button>
                                                        <Button variant="primary" size='md' className='btn-responsive btn-small-text' onClick={() => handleMenuDetails(menu.menu_id)}>Editar Platillos</Button>
                                                    </Stack>
                                                </Col>
                                                <Col xs='12' md='6' lg='3' className="text-center align-items-center mt-2 px-2">
                                                    <Stack direction="vertical" gap={2} className="m-auto d-flex justify-content-center align-middle flex-wrap">
                                                        <Button variant="success" size='md' className='btn-responsive btn-small-text' onClick={() => handlePublish(menu.menu_id)}>Publicar</Button>
                                                        <Button variant="warning" size='md' className='btn-responsive btn-small-text' onClick={() => handleUnpublish(menu.menu_id)}>Privatizar</Button>
                                                        <DeleteMenuModal data={menu} />
                                                    </Stack>

                                                </Col>
                                            </Row>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        ) : (
                            <h2>No hay menús guardados, haz click en Nuevo Menú</h2>

                        )
                    ) : (
                        <Spinner animation="border" variant="danger" />
                    )}
                </Row>

                <h2 className="mb-4 mx-2 mt-4 fw-bold text-orange">NOVEDADES Y ANUNCIOS</h2>
                <Row className="menu-list p-4 shadow rounded d-flex mx-2">
                    {Array.isArray(store.restaurantNews) ? (
                        store.restaurantNews.length > 0 ? (
                            <Accordion className="w-100">
                                {store.restaurantNews.map((item, index) => (
                                    <Accordion.Item eventKey={item.id} key={item.id}>
                                        <Accordion.Header className="custom-accordion-header"><div className="fw-bold text-bw fs-5">{`${item.title} (ID: ${item.id})`}</div></Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col xs='12' md='6' lg='4' className="justify-content-start mb-2">
                                                    <div className="m-auto align-middle">
                                                        <div className="mb-1"><strong>Categoría: </strong> {`${item.category}`}</div>
                                                        <div className="mb-1"><strong>Descripción: </strong> {`${item.description}`}</div>


                                                    </div>
                                                </Col>
                                                <Col xs='12' md='6' lg='4' className="justify-content-start align-middle mb-2">
                                                    <div className="m-auto align-middle">
                                                        <div className="mb-1"><strong>Creado: </strong>{item.created_at}</div>
                                                        <div><strong>Expiración: </strong> {item.expiration_date}</div>
                                                    </div>

                                                </Col>

                                                <Col xs='12' md='6' lg='4' className="justify-content-start align-middle mb-2">
                                                    <div>
                                                        <strong>Imagen: </strong>
                                                        <a href={item.image} target="_blank" rel="noopener noreferrer">
                                                            {item.image}
                                                        </a>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="text-center align-items-center mt-2 px-2">
                                                <Stack direction="horizontal" gap={2} className="m-auto justify-content-center align-middle flex-wrap" >
                                                    <Button variant="danger" size='md' className='btn-responsive btn-small-text' onClick={() => handleDeleteNews(item.id)}>Eliminar</Button>
                                                    <Button variant="primary" size='md' className='btn-responsive btn-small-text' onClick={() => handleEditNews(item)}>Editar</Button>
                                                </Stack>
                                            </Row>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        ) : (
                            <h2>No hay novedades guardadas, haz click en Publicar Novedad</h2>
                        )
                    ) : (
                        <Spinner animation="border" variant="danger" />

                    )}
                </Row>



                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Menú</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label className="fw-bold">Nombre del Menú</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="fw-bold">Moneda</Form.Label>
                                <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)} className="gray-dropdown">
                                    <option value="COP">COP</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="CAD">CAD</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="close-modal-button mx-1" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                        <Button className="orange-button mx-1" onClick={handleUpdateMenu}>Guardar Cambios</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default RestaurantDashboard;
