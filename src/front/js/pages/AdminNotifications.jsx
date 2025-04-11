import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, ListGroup, Tabs, Tab, Table } from "react-bootstrap";
import AdminNavbar from "../component/AdminNavbar.jsx";
import '../../styles/index.css';
import { showLoadingError, showDeleteError } from "../store/utils.js";

const AdminNotifications = () => {

    const { store, actions } = useContext(Context);

    const onLoad = async () => {
        const notifications = await actions.adminGetNotifications()
        if (!notifications) {
            showLoadingError('notificaciones')
        }
    }


    const handleDelete = async (id) => {
        const response = await actions.deleteNotification(id)
        if (!response) showDeleteError('notificación')
    }

    useEffect(() => {
        onLoad()
    }, [])
    return (
        <>
            <AdminNavbar />
            <Container fluid>
                {store.notifications.length > 0 ? (<Table striped responsive className="my-4 table-2">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Restaurante</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Asunto</th>
                            <th>Mensaje</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        {store.notifications.map((notif, index) => (
                            <tr key={notif.notification_id}>
                                <td>{notif.notification_id}</td>
                                <td>{notif.restaurant.id}</td>
                                <td>{notif.restaurant.name}</td>
                                <td>{notif.restaurant.email}</td>
                                <td>{notif.subject}</td>
                                <td>{notif.message}</td>
                                <td>{notif.date}</td>
                                <td>
                                    <div className="justify-content-around d-flex align-middle">
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(notif.notification_id)}>Eliminar</Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        }

                    </tbody>
                </Table>

                ) : (<div>No hay notificaciones en estos momentos</div>)}
            </Container>


        </>
    )

}


export default AdminNotifications