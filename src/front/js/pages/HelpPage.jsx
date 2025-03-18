import React from "react";
import { Container } from "react-bootstrap";
import ClientNavbar from "../component/ClientNavbar.jsx";

const HelpPage = () => {
  return (
    <div>
      <ClientNavbar />
      <Container className="mt-4">
        <h2>Ayuda</h2>
        <p>¿Necesitas asistencia? Consulta nuestras preguntas frecuentes o contáctanos.</p>
      </Container>
    </div>
  );
};

export default HelpPage;