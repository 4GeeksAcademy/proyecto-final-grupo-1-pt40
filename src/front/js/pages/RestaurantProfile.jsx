import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const RestaurantProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { restaurant_id } = useParams();

    useEffect(() => {
        actions.getRestaurantDetails(restaurant_id);
    }, [restaurant_id]);

    const profile = store.restaurantDetails;

    useEffect(() => {
        console.log("Perfil recibido:", profile);
    }, [profile]);

    if (!profile) {
        return <div className="text-center mt-5">Cargando información del restaurante...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="profile-card text-center p-4 bg-white shadow rounded">
                <img
                    src={profile.image ? profile.image.trim() : "https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg"}
                    alt="Profile"
                    className="profile-img rounded-circle mb-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg"; }}
                />
                <h2>{profile.name}</h2>
                <p className="text-muted">@{profile.username}</p>

                <div className="row mt-4 text-start">
                    <div className="col-md-6">
                        <p><strong>Departamento:</strong> {profile.department}</p>
                        <p><strong>Ciudad:</strong> {profile.city}</p>
                        <p><strong>Dirección:</strong> {profile.exact_address || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> {profile.phone || "No disponible"}</p>
                    </div>
                    <div className="col-md-6">
                        {profile.schedule ? (
                            <div>
                                <p>
                                    <strong className="pb-1">Horario de Atención</strong>
                                </p>

                                <p>
                                    <strong>Entre semana:</strong> {profile.schedule.week.open} - {profile.schedule.week.close}
                                </p>
                                <p>
                                    <strong>Fines de semana:</strong> {profile.schedule.weekend.open} - {profile.schedule.weekend.close}
                                </p>



                            </div>
                        ) : (
                            <p>No disponible</p>
                        )}
                        <p><strong>Tipo de Cocina:</strong> {profile.cuisine_type || "No especificado"}</p>
                        <p><strong>Descripción:</strong> {profile.description || "No disponible"}</p>
                    </div>
                </div>

                <div className="social-icons mt-3">
                    {profile.social_networks
                        ? profile.social_networks.split(",").map((network, index) => (
                            <a key={index} href={network.trim()} className="me-3" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook fa-2x text-primary"></i>
                            </a>
                        ))
                        : <p>No tiene redes sociales registradas</p>
                    }
                </div>

                <div className="mt-4">
                    <button className="btn btn-primary me-3" onClick={() => navigate("/add-menu")}>
                        Añadir menú
                    </button>
                    <button className="btn btn-success" onClick={() => navigate(`/edit-restaurant/${restaurant_id}`)}>
                        Editar perfil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;
