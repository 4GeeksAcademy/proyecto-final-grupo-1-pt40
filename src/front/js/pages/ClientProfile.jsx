import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ClientNavbar from "../component/ClientNavbar.jsx";
import "../../styles/ClientProfile.css";

const ClientProfile = () => {
  const { store, actions } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const onLoad = async () => {
    const response = await actions.getClientDetails();
    if (response) {
      setProfile(response);
      console.log("Datos del cliente recibidos:", response);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  if (!profile) {
    return <div className="text-center mt-5">Cargando información del cliente...</div>;
  }

  const departmentName = profile.department?.name || profile.department || "No especificado";
  const cityName = profile.city?.name || profile.city || "No especificada";

  return (
    <div>
      <ClientNavbar />
      <div className="profile-container">
        <Container className="profile-content mt-5">
          <div className="profile-header">
            <div className="profile-pic-container">
              <img
                src={profile.image ? profile.image.trim() : "https://thumbs.dreamstime.com/b/avatar-de-imagen-perfil-predeterminado-icono-usuario-persona-an%C3%B3nimo-iconos-masculino-y-marcador-posici%C3%B3n-fotograf%C3%ADa-hombre-272206807.jpg"}
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  e.target.src = "https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg";
                }}
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{profile.name || profile.username}</h1>
              <p className="profile-username">@{profile.username}</p>
              <div className="profile-meta">
                <span className="meta-item">
                  <i className="fas fa-envelope me-1"></i>
                  {profile.email || "No disponible"}
                </span>
                <span className="meta-item">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {cityName}, {departmentName}
                </span>
              </div>
              <Button className="profile-button mt-3" onClick={() => navigate(`/edit-client/`)}>
                Editar Perfil
              </Button>
            </div>
          </div>
          <Row className="mt-5">
            <Col md={12}>
              <Card className="info-section mb-4">
                <Card.Body>
                  <Card.Title className="section-title">Información Personal</Card.Title>
                  <p><strong>Nombre de usuario:</strong> {profile.username}</p>
                  <p><strong>Email:</strong> {profile.email || "No disponible"}</p>
                  <p><strong>Ubicación:</strong> {cityName}, {departmentName}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ClientProfile;