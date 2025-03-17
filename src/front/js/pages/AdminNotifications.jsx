import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, ListGroup, Tabs, Tab, Table } from "react-bootstrap";
import NotificationModal from "../component/NotificationModal.jsx";
import AdminNavbar from "../component/AdminNavbar.jsx";


const AdminNotifications = () => {

    const { store, actions } = useContext(Context);

    const onLoad = async () => {
        const notifications = await actions.adminGetNotifications()
        if (!notifications) {
            alert('Error cargando notificaciones'
            )
        }
    }


    const handleDelete = async (id) => {
        const response = await actions.deleteNotification(id)
        if (!response) alert('Error eliminando notificacion')
    }

    useEffect(() => {
        onLoad()
    }, [])
    return (

        <Container fluid>
            <AdminNavbar />
            {store.notifications.length > 0 ? (<Table striped responsive className="my-4">
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
    )

}


export default AdminNotifications