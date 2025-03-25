import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import MainNavbar from "../component/MainNavbar.jsx";
import "../../styles/home.css";
import Logo from "../../img/logo.png"

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	return (
		<Container fluid className="landing-page m-0 p-0">
			<MainNavbar />
			{/* Hero Section */}
			<section className="hero-section text-white text-center py-5">
				<Container>
					<h1 className="display-4 fw-bold">Descubre los mejores restaurantes</h1>
					<p className="lead mt-3">
						Explora menús, guarda favoritos y disfruta sin complicaciones.
					</p>
				</Container>
			</section>

			{/* Beneficios */}
			<section className="features-section py-5">
				<Container>
					<h2 className="text-center mb-5 text-orange fs-1">¿Por qué elegir <strong>ALPUNT<img className='img-logo-bullseye' src={Logo} /></strong>?</h2>
					<Row className="g-4">
						<Col md={4}>
							<Card className="feature-card h-100">
								<Card.Img variant="top" src="https://media.istockphoto.com/id/1217807835/es/foto/esto-es-delicioso.jpg?s=612x612&w=0&k=20&c=aC-_yZtvMCvDRBvx3-sStfQG0oRyZModDFO4_5d9GVk=" />
								<Card.Body>
									<Card.Title className="text-orange">Encuentra tus favoritos</Card.Title>
									<Card.Text>
										Filtra por ubicación y tipo de comida para descubrir nuevas joyas gastronómicas cerca de ti.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card className="feature-card h-100">
								<Card.Img variant="top" src="https://www.brillante.es/wp-content/uploads/2023/10/typical-spanish-pincho-de-tortilla-spanish-omelet-2023-03-24-22-52-58-utc.jpg" />
								<Card.Body>
									<Card.Title className="text-orange">Menús actualizados</Card.Title>
									<Card.Text>
										Accede a los menús más recientes con fotos y precios antes de visitar cualquier restaurante.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card className="feature-card h-100">
								<Card.Img variant="top" src="https://cdn-3.expansion.mx/dims4/default/9fda231/2147483647/strip/true/crop/2120x1413+0+0/resize/1800x1200!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2Fe6%2Fdf%2F2d6ed6254ff3ae608bbfc258e371%2Fistock-1357886752.jpg" />
								<Card.Body>
									<Card.Title className="text-orange">Guarda tus favoritos</Card.Title>
									<Card.Text>
										Crea tu lista personalizada de lugares favoritos para volver una y otra vez.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</section>

			{/* CTA Final */}
			<section className="cta-section text-center py-5">
				<Container>
					<h2 className="fw-bold mb-4">¿Listo para explorar lo mejor de tu ciudad?</h2>
				</Container>
			</section>
		</Container>
	);
};
