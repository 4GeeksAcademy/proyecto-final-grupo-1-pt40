import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Dropdown, Badge } from "react-bootstrap";
import { Bell } from "react-bootstrap-icons";

const NotificationBell = () => {
    const { store, actions } = useContext(Context);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    useEffect(() => {
        loadNotifications();
        
        const interval = setInterval(loadNotifications, 60000); 
        return () => clearInterval(interval);
    }, []);
    
    const loadNotifications = async () => {
        const result = await actions.getRestaurantNotifications();
        setNotifications(result);
    };
    
    const handleMarkAsRead = async (notification_id) => {
        const success = await actions.markNotificationAsRead(notification_id);
        if (success) {
            
            setNotifications(notifications.filter(n => n.notification_id !== notification_id));
        }
    };
    
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    
    return (
        <Dropdown 
            show={showDropdown} 
            onToggle={(isOpen) => setShowDropdown(isOpen)}
            align="end"
        >
            <Dropdown.Toggle
                variant="link"
                id="dropdown-notifications"
                className="nav-link position-relative"
                style={{ color: "inherit", textDecoration: "none" }}
            >
                <Bell size={20} color="white" />
                {notifications.length > 0 && (
                    <Badge 
                        bg="danger" 
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                        style={{ fontSize: "0.6rem" }}
                    >
                        {notifications.length}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "400px", maxHeight: "400px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                    <Dropdown.Item disabled>No hay notificaciones</Dropdown.Item>
                ) : (
                    notifications.map((notification) => (
                        <Dropdown.Item key={notification.notification_id} className="d-flex flex-column border-bottom">
                            <div className="fw-bold mb-1">{notification.subject}</div>
                            <div className="text-muted small">{notification.message}</div>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                                <small className="text-muted">{formatDate(notification.date)}</small>
                                <button 
                                    className="btn btn-sm gray-button" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification.notification_id);
                                    }}
                                >
                                    Marcar como leída
                                </button>
                            </div>
                        </Dropdown.Item>
                    ))
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;