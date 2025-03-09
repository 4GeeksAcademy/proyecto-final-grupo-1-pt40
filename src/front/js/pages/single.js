import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import PayPal from "../component/PayPal.jsx"
import GoogleMapsModal from "../component/GoogleMapsModal.jsx"

export const Single = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	return (
		<Container className="text-center mt-5">
			<PayPal />
			<GoogleMapsModal />
		</Container>
	);
};
