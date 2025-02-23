import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, ListGroup, Card } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Widget } from "@uploadcare/react-widget";

function EditModal({ dish }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [newDish, setNewDish] = useState(dish);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleEdit = async () => {
        await actions.menuBuilderEditDish(dish.id, newDish, dish.category)
        setShow(false)
    }

    const handleFileChange = (file) => {
        setNewDish({ ...newDish, image: file.cdnUrl })
    }
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Editar Plato
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar platillo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Nombre del Platillo"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        />
                        <Widget publicKey='47bd03853371888b5541' value={newDish.image} onChange={handleFileChange} />
                        <Form.Control
                            as="textarea"
                            placeholder="Descripción del Platillo"
                            className="mt-2"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Precio del Platillo"
                            className="mt-2"
                            value={newDish.price}
                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;