import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, Dropdown, DropdownButton } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function CreateMenuModal({ restaurant_id }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [newMenu, setNewMenu] = useState({ 'name': '', 'restaurant_id': restaurant_id, 'currency': 'Selecciona una moneda' });
    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleCreate = async () => {
        if (newMenu.currency.length > 3 || !newMenu.name) {
            alert('Debes escoger un nombre y una moneda para crear un menu')
        }
        const response = await actions.createMenu(newMenu)
        if (response) {
            navigate(`/menu-builder/${response.id}`)
            setShow(false)
        }
    }

    const handleSelect = (eventKey) => {
        setNewMenu({ ...newMenu, currency: eventKey })
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Crear Nuevo Menú
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
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Nombre el Menú"
                            value={newMenu.name}
                            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                        />
                        <DropdownButton className="mt-3" id="dropdown-basic-button" title={newMenu.currency} onSelect={handleSelect}>
                            <Dropdown.Item eventKey="COP">Pesos Colombianos</Dropdown.Item>
                            <Dropdown.Item eventKey="USD">Dólares Americanos</Dropdown.Item>
                            <Dropdown.Item eventKey="CAD">Dólares Canadienses</Dropdown.Item>
                            <Dropdown.Item eventKey="EUR">Euros</Dropdown.Item>
                        </DropdownButton>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>Crear Menú</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateMenuModal;