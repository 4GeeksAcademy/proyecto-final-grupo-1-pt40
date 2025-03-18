import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import ClientNavbar from "../component/ClientNavbar.jsx";

const ClientProfile = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const onLoad = async () => {
        const response = await actions.getClientDetails();
        if (response) setProfile(response);
    };

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        console.log("Perfil de cliente recibido:", profile);
    }, [profile]);

    if (!profile) {
        return <div className="text-center mt-5">Cargando información del cliente...</div>;
    }

    return (
        <div>
            <ClientNavbar />
            <div className="container mt-5">
                <div className="profile-card text-center p-4 bg-white shadow rounded">
                    <img
                        src="https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg"
                        alt="Profile"
                        className="profile-img rounded-circle mb-3"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <h2>{profile.username}</h2>
                    <p className="text-muted">@{profile.username}</p>

                    <div className="row mt-4 text-start">
                        <div className="col-md-6">
                            <p><strong>Email:</strong> {profile.email || "No disponible"}</p>
                            <p><strong>Departamento:</strong> {profile.department || "No especificado"}</p>
                            <p><strong>Ciudad:</strong> {profile.city || "No especificada"}</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={() => navigate(`/edit-client/`)}
                        >
                            Editar perfil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;