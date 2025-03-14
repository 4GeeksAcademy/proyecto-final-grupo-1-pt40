import React from "react";
import { Link } from "react-router-dom";
import CreateMenuModal from "./CreateMenuModal.jsx"; // Ajusta la ruta según tu estructura
import LogoutButton from "./LogoutButton.jsx";

const RestaurantNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 shadow rounded">
      <div className="container-fluid">
        <Link to="/restaurant-dashboard" className="navbar-brand fw-bold">Al punto</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <CreateMenuModal />
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/edit-restaurant/">
                Agregar Información
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/restaurant-profile/">
                Mi Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/plan-purchase/">
                AlPunto+
              </Link>
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