import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Spinner from 'react-bootstrap/Spinner';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("restaurants");
    const { store, actions } = useContext(Context);

    const onLoad = async () => {
        await actions.getRestaurants();
    }
    useEffect(() => {
        onLoad()
    }, [])


    // Datos simulados de restaurantes
    const restaurantData = [
        {
            id: 1,
            name: "Restaurante La Buena Mesa",
            description: "Deliciosa comida local.",
            image: "https://via.placeholder.com/300x200?text=Restaurante+1"
        },
        {
            id: 2,
            name: "Pizzería El Molino",
            description: "Pizzas artesanales y tradicionales.",
            image: "https://via.placeholder.com/300x200?text=Restaurante+2"
        },
        {
            id: 3,
            name: "Sushi World",
            description: "Auténtico sushi japonés.",
            image: "https://via.placeholder.com/300x200?text=Restaurante+3"
        }
    ];



    // Renderiza el contenido según la opción del menú seleccionada
    const renderContent = () => {
        switch (activeMenu) {
            case "perfil":
                return (
                    <div>
                        <h2>Perfil</h2>
                        <p>Visualiza y actualiza tu información personal.</p>
                        {/* Aquí podrías incluir un formulario o detalles del perfil */}
                    </div>
                );
            case "favoritos":
                return (
                    <div>
                        <h2>Favoritos</h2>
                        <p>Aquí se mostrarán tus restaurantes y platillos favoritos.</p>
                        {/* Puedes renderizar una lista de favoritos obtenidos de tu estado o contexto */}
                    </div>
                );
            case "ayuda":
                return (
                    <div>
                        <h2>Ayuda</h2>
                        <p>¿Necesitas asistencia? Consulta nuestras preguntas frecuentes o contáctanos.</p>
                        {/* Agrega información o enlaces a recursos de ayuda */}
                    </div>
                );
            default:
                // Mostrar las opciones de restaurantes por defecto
                return (
                    <div>
                        <h2>Opciones de Restaurante</h2>
                        <div className="row">
                            {restaurantData.map((restaurant) => (
                                <div key={restaurant.id} className="col-md-4 mb-3">
                                    <div className="card">
                                        <img
                                            src={restaurant.image}
                                            className="card-img-top"
                                            alt={restaurant.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{restaurant.name}</h5>
                                            <p className="card-text">{restaurant.description}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                                            >
                                                Ver Menú
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex mb-4">
                <button
                    className={`btn btn-outline-primary me-2 ${activeMenu === "restaurants" ? "active" : ""}`}
                    onClick={() => setActiveMenu("restaurants")}
                >
                    Restaurantes
                </button>
                <button
                    className={`btn btn-outline-primary me-2 ${activeMenu === "perfil" ? "active" : ""}`}
                    onClick={() => setActiveMenu("perfil")}
                >
                    Perfil
                </button>
                <button
                    className={`btn btn-outline-primary me-2 ${activeMenu === "favoritos" ? "active" : ""}`}
                    onClick={() => setActiveMenu("favoritos")}
                >
                    Favoritos
                </button>
                <button
                    className={`btn btn-outline-primary ${activeMenu === "ayuda" ? "active" : ""}`}
                    onClick={() => setActiveMenu("ayuda")}
                >
                    Ayuda
                </button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default ClientDashboard;