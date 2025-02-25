import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const RestaurantDashboard = () => {
    const { store, actions } = useContext(Context);
    const id = localStorage.getItem('restaurant')
    const navigate = useNavigate()
    const createMenuClick = async () => {
        const response = await actions.createMenu('Menu', id)
        if (response) {
            navigate(`/menu-builder/${response.id}`)
        }

    }

    const onLoad = async () => {
        if (await actions.getRestaurantMenus()) {
            console.log("Menús cargados correctamente.");
        } else {
            console.error("Error al cargar los menús.");
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
                                <Link className="nav-link" onClick={createMenuClick}>Crear Menú</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/restaurant-form">Agregar Información</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/restaurant-profile">Mi Perfil</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <h2 className="mb-4">Mi Menú</h2>
            <div className="menu-list bg-white p-4 shadow rounded d-flex">
                {Array.isArray(store.menuRestaurant) ? (
                    store.menuRestaurant.length > 0 ? (
                        store.menuRestaurant.map((menu) => (
                            <Card style={{ width: '18rem' }} key={menu.id}>
                                <Card.Body>
                                    <Card.Title>{menu.name}</Card.Title>
                                    <Card.Text>
                                        <p>{`Creado: ${menu.created}`}</p>
                                        <p>{`Última actialización: ${menu.last_updated}`}</p>
                                    </Card.Text>
                                    <Card.Link href={`/menu-builder/${menu.id}`}>Edit Menu</Card.Link>
                                    <Card.Link href={`/menu/${menu.id}`}>View Menu</Card.Link>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <Spinner animation="border" variant="danger" />
                    )
                ) : (
                    <h2>No hay menús guardados, haz click en Crear Menú</h2>
                )}
            </div>
        </div >
    );
};

export default RestaurantDashboard;
