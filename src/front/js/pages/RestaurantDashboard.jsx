import React from "react";
import { Link } from "react-router-dom";

const RestaurantDashboard = () => {
    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 p-3 shadow rounded">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold">Al punto</span>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/menu-builder">Crear Menú</Link>
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
            <div className="menu-list bg-white p-4 shadow rounded">
                
                <p>Aquí se mostrará el menú creado.</p>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
