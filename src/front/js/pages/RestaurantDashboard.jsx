import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Accordion, Alert, Modal, Form } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import CreateMenuModal from "../component/CreateMenuModal.jsx";
import DeleteMenuModal from "../component/DeleteMenuModal.jsx"

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
    const handleUpdateMenu = () => {
        if (selectedMenu) {
            actions.updateMenu(selectedMenu.menu_id, { name: menuName, currency: currency });
            setShowEditModal(false);
        }
    };


    useEffect(() => {
        onLoad()
    }, [])

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 p-3 shadow rounded">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold">Al punto</span>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <CreateMenuModal />
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/edit-restaurant/">Agregar Información</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/restaurant-profile/`}>Mi Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/plan-purchase/`}>AlPunto+</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            {alert === 'Public' ? (<Alert key={1} variant='success'>
                Menú publicado con éxito, se encuentra disponible para todo público
            </Alert>) : ''}

            {alert === 'Private' ? (<Alert key={2} variant='primary'>
                Menú privatizado, no encuentra disponible para los clientes
            </Alert>) : ''}

            <h2 className="mb-4">Mis Menús</h2>
            <div className="menu-list bg-white p-4 shadow rounded d-flex w-100">
                {Array.isArray(store.restaurantMenus) ? (
                    store.restaurantMenus.length > 0 ? (
                        <Accordion className="w-100">
                            {store.restaurantMenus.map((menu) => (
                                <Accordion.Item eventKey={menu.menu_id} key={menu.menu_id}>
                                    <Accordion.Header>{menu.name}</Accordion.Header>
                                    <Accordion.Body>
                                        <p>{`Creado: ${menu.created}`}</p>
                                        <p>{`Última actialización: ${menu.last_updated}`}</p>
                                        <p>{`Moneda: ${menu.currency}`}</p>
                                        <p>{`Estatus: ${menu.is_active ? "Público" : 'Privado'}`}</p>
                                        <div className="d-flex justify-content-between w-50">
                                            <Button variant="light" onClick={() => handleView(menu.menu_id)}>Ver</Button>
                                            <Button variant="primary" onClick={() => handleMenuDetails(menu.menu_id)}>Personalizar</Button>
                                            <Button variant="success" onClick={() => handlePublish(menu.menu_id)}>Publicar</Button>
                                            <Button variant="warning" onClick={() => handleUnpublish(menu.menu_id)}>Privatizar</Button>
                                            <DeleteMenuModal data={menu} />
                                            <Button variant="info" onClick={() => handleOpenEditModal(menu)}>Editar Información</Button>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    ) : (
                        <Spinner animation="border" variant="danger" />
                    )
                ) : (
                    <h2>No hay menús guardados, haz click en Crear Menú</h2>
                )}
            </div>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Menú</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre del Menú</Form.Label>
                            <Form.Control
                                type="text"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Divisa</Form.Label>
                            <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="USD">USD</option>
                                <option value="COP">COP</option>
                                <option value="EUR">EUR</option>
                                <option value="CAD">CAD</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleUpdateMenu}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
};

export default RestaurantDashboard;
