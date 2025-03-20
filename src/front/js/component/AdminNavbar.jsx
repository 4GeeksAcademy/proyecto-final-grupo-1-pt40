import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaHome, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import '../../styles/index.css';

function AdminNavbar() {
    return (
        <Navbar expand="lg" style={{ backgroundColor: 'F8FAFC' }}>
            <Container>
                <Navbar.Brand href="/" style={{ color: '#FF6C40', fontWeight: 900, fontSize: '1.8rem' }}>AlPunto</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
                    <span className="navbar-toggler-icon custom-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="/admin-dashboard">
                        <FaHome className="me-1" /> Panel de Control
                    </Nav.Link>
                        <Nav.Link href="/admin-reports">
                            <FaExclamationTriangle className="me-1" /> Reportes
                        </Nav.Link>

                        <Nav.Link href="/admin-notifications">
                            <FaBell className="me-1" />Centro de Notificaciones
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;