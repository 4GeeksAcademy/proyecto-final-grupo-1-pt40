import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, Dropdown, DropdownButton } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function CreateMenuModal({ data }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const id = localStorage.getItem('restaurant')
    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onLoad = async () => {
        if (await actions.getRestaurantMenus(id)) {
            console.log("Menús cargados correctamente.");
        } else {
            console.error("Error al cargar los menús.");
        }
    };
    const handleDelete = async () => {
        const response = await actions.deleteMenu(data.id)
        setShow(false)
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Eliminar
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>

                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Elimnar Menú</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{`El menú: ${data.name} sera eliminado permanentemente.`}</p>
                    <p>¿Estas seguro de que deseas continuar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>Eliminar Menú</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateMenuModal;