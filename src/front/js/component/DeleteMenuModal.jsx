import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function CreateMenuModal({ data }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        const response = await actions.deleteMenu(data.menu_id)
        setShow(false)
    }

    return (
        <>
            <Button variant="danger" className='btn-responsive btn-small-text' size='md' onClick={handleShow}>
                Eliminar
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>

                <Modal.Header closeButton>
                    <Modal.Title>¿Deseas eliminar el menú?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>{data.name}</strong>{` será eliminado permanentemente.`}</p>
                    <p>¿Estas seguro de continuar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateMenuModal;