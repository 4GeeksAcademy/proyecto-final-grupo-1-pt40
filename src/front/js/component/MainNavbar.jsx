import React from "react";
import { Link } from "react-router-dom";


const MainNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 shadow rounded">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold">Al punto</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/how-work/">
                                Sobre nosotros
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/frequent-questions/">
                                Preguntas frecuentes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact/">
                                Contáctanos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn btn-outline-primary" to="/signup/">
                                Registrarse
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn btn-outline-success" to="/login/">
                                Iniciar sesión
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar;