import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import LogoutButton from "./LogoutButton.jsx";

const ClientNavbar = ({ activeMenu, setActiveMenu }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>El punto</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link
            onClick={() => setActiveMenu("restaurants")}
            active={activeMenu === "restaurants"}
          >
            Restaurantes
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveMenu("explore")}
            active={activeMenu === "explore"}
          >
            Explora
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveMenu("perfil")}
            active={activeMenu === "perfil"}
          >
            Perfil
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveMenu("favoritos")}
            active={activeMenu === "favoritos"}
          >
            Favoritos
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveMenu("ayuda")}
            active={activeMenu === "ayuda"}
          >
            Ayuda
          </Nav.Link>
          <Nav.Link>
            <LogoutButton/>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default ClientNavbar;