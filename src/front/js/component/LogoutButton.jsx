import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Context } from "../store/appContext";



const LogoutButton = () => {
    const { store, actions } = useContext(Context);
    const navigateTo = useNavigate()

    const handleLogout = async () => {
        const response = await actions.logout();
        if (response) { 
            navigateTo('/login')
         }else if (!response){
            alert('Algo salió mal, vuelve a intentarlo')
         }
    }
    return (
        <Button variant="danger" onClick={handleLogout}>Salir</Button>
    )



}

export default LogoutButton