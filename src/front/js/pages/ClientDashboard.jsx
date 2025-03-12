import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import FavoritePage from "./FavoritePage.jsx";
import ExplorePage from "./ExplorePage.jsx";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FavoriteButton from "../component/FavoriteButton.jsx"
import ClientProfile from "./ClientProfile.jsx";
import ClientNavbar from "../component/ClientNavbar.jsx";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("restaurants");
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getRestaurants();
    }, []);

    
    const renderContent = () => {
        switch (activeMenu) {
            case "perfil":
                return <ClientProfile />;

            case "favoritos":
                return <FavoritePage />;

            case "ayuda":
                return (
                    <div>
                        <h2>Ayuda</h2>
                        <p>¿Necesitas asistencia? Consulta nuestras preguntas frecuentes o contáctanos.</p>
                    </div>
                );
            case "explore":
                return <ExplorePage />

            default:
                
                return (
                    <div>
                        <h2>Opciones de Restaurante</h2>
                        <div className="row">
                            {Array.isArray(store.restaurants) && store.restaurants.length > 0 ? (
                                store.restaurants.map((restaurant) => (
                                    <div key={restaurant.restaurant_id} className="col-md-4 mb-3">
                                        <div className="card">
                                            <img
                                                src={restaurant.image || "https://via.placeholder.com/300x200?text=Restaurante"}
                                                className="card-img-top"
                                                alt={restaurant.name}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{restaurant.name}</h5>
                                                <p className="card-text">{restaurant.description}</p>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => navigate(`/menu/1`)}
                                                >
                                                    Ver Menú
                                                </button>
                                                
                                                <FavoriteButton restaurant_id={restaurant.restaurant_id} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay restaurantes disponibles.</p>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            <ClientNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <Container className="mt-4">{renderContent()}</Container>
        </div>
    );
};

export default ClientDashboard;

