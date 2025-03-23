import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import "../../styles/RestaurantProfile.css";

const RestaurantProfile = () => {
  const { store, actions } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const onLoad = async () => {
    const response = await actions.getRestaurantDetails();
    if (response) {
      setProfile(response);
      console.log("Datos del restaurante recibidos:", response);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  const convertToAmPm = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  if (!profile) {
    return <div className="text-center mt-5">Cargando información del restaurante...</div>;
  }

  const departmentName = profile.department?.name || profile.department || "No disponible";
  const cityName = profile.city?.name || profile.city || "No disponible";

  return (
    <div>
      <RestaurantNavbar />
      <div className="profile-container">
        <Container className="profile-content mt-5">
          <div className="profile-header">
            <div className="profile-pic-container">
              <img
                src={profile.image ? profile.image.trim() : "https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg"}
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  e.target.src = "https://i.pinimg.com/236x/59/b5/91/59b591cbaee5d0b308648cfbae25d78a.jpg";
                }}
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-username">@{profile.username}</p>
              <div className="profile-meta">
                <span className="meta-item">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {cityName}, {departmentName}
                </span>
                <span className="meta-item">
                  <i className="fas fa-phone me-1"></i>
                  {profile.phone || "No disponible"}
                </span>
                <span className="cuisine-tag">{profile.cuisine_type || "No especificado"}</span>
              </div>
              <Button className="profile-button mt-3" onClick={() => navigate(`/edit-restaurant/`)}>
                Editar Perfil
              </Button>
            </div>
          </div>
          <Row className="mt-5">
            <Col md={12}>
              <Card className="info-section mb-4">
                <Card.Body>
                  <Card.Title className="section-title">Descripción</Card.Title>
                  <p>{profile.description || "No disponible"}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}> 
              <Card className="info-section mb-4">
                <Card.Body>
                  <Card.Title className="section-title">Horario de Atención</Card.Title>
                  {profile.schedule ? (
                    profile.schedule.map((day, index) => (
                      <p key={index} className="schedule-item">
                        {`${day.day}: ${day.isClosed ? "Cerrado" : `${convertToAmPm(day.open)} - ${convertToAmPm(day.close)}`}`}
                      </p>
                    ))
                  ) : (
                    <p>No disponible</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default RestaurantProfile;