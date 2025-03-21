import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, Dropdown, DropdownButton, Row, Col } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function CreateMenuModal() {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [newMenu, setNewMenu] = useState({ 'name': '', 'currency': 'Selecciona una moneda' });
    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleCreate = async () => {
        if (newMenu.currency.length > 3 || !newMenu.name) {
            alert('Debes escoger un nombre y una moneda para crear un menu')
        }
        const response = await actions.createMenu(newMenu)
        if (response) {
            navigate(`/menu-builder/${response.menu_id}`)
            setShow(false)
        }
    }

    const handleSelect = (eventKey) => {
        setNewMenu({ ...newMenu, currency: eventKey })
    }

    return (
        <>
            <Button className='orange-button' onClick={handleShow}>
                Nuevo Menú
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Datos del Menú</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form>
                        <Row className="d-flex justify-content-between">
                            <Col xs md lg='6'>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del Menú"
                                    value={newMenu.name}
                                    onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                                />
                            </Col>
                            <Col xs md lg='6'>
                                <DropdownButton id="dropdown-basic-button" title={newMenu.currency} onSelect={handleSelect} className="gray-dropdown">
                                    <Dropdown.Item eventKey="COP">COP</Dropdown.Item>
                                    <Dropdown.Item eventKey="USD">USD</Dropdown.Item>
                                    <Dropdown.Item eventKey="EUR">EUR</Dropdown.Item>
                                    <Dropdown.Item eventKey="CAD">CAD</Dropdown.Item>
                                </DropdownButton>
                            </Col>

                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="close-modal-button mx-1" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button  className="orange-button mx-1" onClick={handleCreate}>Crear Menú</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default CreateMenuModal;