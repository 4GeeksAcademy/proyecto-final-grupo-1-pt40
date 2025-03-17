import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

const ClientNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 shadow rounded">
      <div className="container-fluid">
        <Link to="/client-dashboard/" className="navbar-brand fw-bold">El punto</Link>
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/client-dashboard/">Restaurantes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore-page/">Explora</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/client-profile/ ">Perfil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favorites/">Favoritos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/help-page/">Ayuda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link"><LogoutButton /></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;