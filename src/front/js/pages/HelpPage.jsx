import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion, Form, Button } from "react-bootstrap";
import ClientNavbar from "../component/ClientNavbar.jsx";

const HelpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    // Resetear formulario o mostrar mensaje de éxito
    alert("Mensaje enviado con éxito. Te contactaremos pronto.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div>
      <ClientNavbar />
      <Container className="my-5">
        <h1 className="text-center mb-4">Centro de Ayuda</h1>

        <Row className="justify-content-center mb-5">
          <Col xs={12} md={8} className="text-center">
            <p className="lead">
              Bienvenido a nuestro centro de ayuda. Aquí encontrarás información útil sobre cómo usar nuestra plataforma 
              para descubrir los mejores restaurantes y sus menús.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col xs={12}>
            <h2 className="mb-4">Preguntas Frecuentes</h2>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>¿Cómo funciona esta plataforma?</Accordion.Header>
                <Accordion.Body>
                  Nuestra plataforma te permite explorar restaurantes y sus menús en tu área. Simplemente navega por las categorías o usa la búsqueda para encontrar opciones que se adapten a tus gustos. Ten en cuenta que no procesamos pedidos ni pagos, solo brindamos información actualizada sobre los restaurantes.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
                <Accordion.Header>¿Cómo puedo buscar restaurantes específicos?</Accordion.Header>
                <Accordion.Body>
                  Puedes utilizar la opcion de explora en donde encontraras el top de restaurantes mas populares de tu ciudad. También puedes filtrar por tipo de cocina, ubicación , palabras clave o el nombre del restaurante que deseas para encontrar exactamente lo que estás buscando.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2">
                <Accordion.Header>¿La información de los menús está actualizada?</Accordion.Header>
                <Accordion.Body>
                  Nos esforzamos por mantener toda la información actualizada, pero los precios y disponibilidad pueden variar. Te recomendamos contactar directamente con el restaurante para confirmar los detalles más recientes.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="3">
                <Accordion.Header>¿Puedo dejar reseñas sobre los restaurantes?</Accordion.Header>
                <Accordion.Body>
                  Actualmente no ofrecemos un sistema de reseñas propio. Te recomendamos visitar las páginas oficiales de los restaurantes o plataformas especializadas en reseñas para compartir tu experiencia.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="4">
                <Accordion.Header>¿Cómo puedo contactar directamente a un restaurante?</Accordion.Header>
                <Accordion.Body>
                  En cada perfil de restaurante, encontrarás su información de contacto, incluyendo número telefónico, dirección .
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="5">
                <Accordion.Header>¿Esta plataforma es gratuita?</Accordion.Header>
                <Accordion.Body>
                  Sí, nuestra plataforma es completamente gratuita para todos los usuarios. No cobramos por acceder a la información de restaurantes y menús.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <Row className="g-5">
          <Col xs={12} lg={6}>
            <h2 className="mb-4">Contáctanos</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                  type="text" 
                  id="name" 
                  placeholder="Tu nombre" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  id="email" 
                  placeholder="tuemail@ejemplo.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Asunto</Form.Label>
                <Form.Control 
                  type="text" 
                  id="subject" 
                  placeholder="¿En qué podemos ayudarte?" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control 
                  as="textarea" 
                  id="message" 
                  rows={4} 
                  placeholder="Escribe tu mensaje aquí" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Enviar Mensaje
              </Button>
            </Form>
          </Col>

          <Col xs={12} lg={6}>
            <h2 className="mb-4">Cómo Usar Nuestra Plataforma</h2>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="mb-4">Guía Rápida</Card.Title>
                <div className="mb-4">
                  <h5>1. Explora Restaurantes</h5>
                  <p>Navega por las diferentes categorías o utiliza los filtros para encontrar restaurantes que se ajusten a tus preferencias.Tambien te mostraremos un top de los mejores restaurantes en tu ciudad.</p>
                </div>
                <div className="mb-4">
                  <h5>2. Consulta Menús Detallados</h5>
                  <p>Accede a los menús completos de cada restaurante, con descripciones de platos e información sobre ingredientes.</p>
                </div>
                <div className="mb-4">
                  <h5>3. Encuentra Información de Contacto</h5>
                  <p>Obtén los datos de contacto directo de los restaurantes para hacer reservas o consultas específicas.</p>
                </div>
                <div>
                  <h5>4. Guarda tus favoritos</h5>
                  <p>Utiliza los botones en forma de corazon para que guardes tus restaurantes o platillos favoritos y siempre tengas acceso a estos de manera sencilla y practica, NO mas busquedas tortuosas por redes sociales o chats.</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xs={12}>
            <Card className="bg-light">
              <Card.Body className="text-center py-4">
                <h3 className="mb-3">¿No encuentras lo que buscas?</h3>
                <p className="mb-0">
                  Nuestro equipo está disponible para ayudarte en <strong>soporte@tudominio.com</strong> o llamando al <strong>(555) 123-4567</strong> de lunes a viernes de 9:00 a 18:00 horas.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HelpPage;