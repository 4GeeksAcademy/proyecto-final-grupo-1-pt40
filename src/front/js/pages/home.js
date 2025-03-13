import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import MainNavbar from "../component/MainNavbar.jsx";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();


	return (
		<div>
			<MainNavbar />
			<Container className="text-center mt-5">
				<h1>Bienvenido Al Punto!</h1>
			</Container>
		</div>
	);
};
