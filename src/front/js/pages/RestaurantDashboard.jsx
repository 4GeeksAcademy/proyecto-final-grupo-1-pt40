import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Accordion, Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import CreateMenuModal from "../component/CreateMenuModal.jsx";
import DeleteMenuModal from "../component/DeleteMenuModal.jsx"
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";

const RestaurantDashboard = () => {
    const { store, actions } = useContext(Context);
    const [alert, setAlert] = useState(null)
    const navigate = useNavigate()

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

    const handleEdit = (id) => {
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

    useEffect(() => {
        onLoad()
    }, [])

    return (
        <div>
            <RestaurantNavbar />
            <div className="container mt-4">
                

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
                                                <Button variant="primary" onClick={() => handleEdit(menu.menu_id)}>Editar</Button>
                                                <Button variant="success" onClick={() => handlePublish(menu.menu_id)}>Publicar</Button>
                                                <Button variant="warning" onClick={() => handleUnpublish(menu.menu_id)}>Privatizar</Button>
                                                <DeleteMenuModal data={menu} />
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

            </div >
        </div>
    );
};

export default RestaurantDashboard;
