import React from "react";
import { Link } from "react-router-dom";
import CreateMenuModal from "./CreateMenuModal.jsx"; // Ajusta la ruta según tu estructura
import LogoutButton from "./LogoutButton.jsx";
import NotificationBell from "./NotificationBell.jsx";
import Logo from "../../img/logo.png"

const RestaurantNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 shadow rounded">
      <div className="container-fluid">
        <Link to="/restaurant-dashboard"
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
          <ul className="navbar-nav ms-auto d-flex  align-items-center flex-wrap gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/restaurant-news">Publicar Novedades</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/plan-purchase/">
                AlPunto+
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/edit-restaurant/">
                Editar Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/restaurant-profile/">
                Mi Perfil
              </Link>
            </li>
            <li className="nav-item">
              <NotificationBell />
            </li>
            <li className="nav-item">
              <Link className="nav-link">
                <LogoutButton />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default RestaurantNavbar;