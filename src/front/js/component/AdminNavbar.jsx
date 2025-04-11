import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaHome, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import '../../styles/index.css';
import Logo from "../../img/logo.png"

function AdminNavbar() {
    return (
        <Navbar expand="lg" className='admin-navbar'>
            <Container fluid>
                <Navbar.Brand href="/admin-dashboard" style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.8rem' }} className='admin-navbar-brand'>ALPUNT<img className='img-logo-bullseye' src={Logo} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
                    <span className="navbar-toggler-icon custom-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/admin-dashboard" className='admin-nav-link'>
                            <FaHome className="me-1" /> Panel de Control
                        </Nav.Link>
                        <Nav.Link href="/admin-reports" className="admin-nav-link">
                            <FaExclamationTriangle className="me-1" /> Reportes
                        </Nav.Link>

                        <Nav.Link href="/admin-notifications" className="admin-nav-link">
                            <FaBell className="me-1" />Centro de Notificaciones
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;