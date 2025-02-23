import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();


	return (
		<Container className="text-center mt-5">
		<h1>Bienvenido a El Punto</h1>
		<p>Elige una opción para continuar:</p>
		<Button variant="primary" className="m-2" onClick={() => navigate("/login")}>
		  Iniciar Sesión
		</Button>
		<Button variant="success" className="m-2" onClick={() => navigate("/signup")}>
		  Registrarse
		</Button>
	  </Container>
	);
};
