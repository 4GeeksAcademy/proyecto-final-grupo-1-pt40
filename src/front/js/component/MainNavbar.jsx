import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../img/logo.png"

const MainNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 shadow rounded">
            <div className="container-fluid">
                <Link to="/"
                    className="navbar-brand text-danger fs-3 fw-bold">ALPUNT<img className='img-logo-bullseye' src={Logo} /></Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center d-flex flex-wrap gap-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/how-work/">
                                Sobre nosotros
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/explore-page/">Explora</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/signup/"
                            >
                                Registrarse
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
                            <Link
                                className="nav-link"
                                to="/login/"
                            >
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