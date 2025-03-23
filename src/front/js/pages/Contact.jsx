import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import MainNavbar from '../component/MainNavbar.jsx';
import '../../styles/index.css';

const Contact = () => {
    return (
        <div>
            <MainNavbar />
            <div className="container my-5">
                <h1 className="text-center mb-4">Contáctanos</h1>

                <section className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 text-center">
                        <p className="lead">
                            ¿Tienes alguna pregunta, sugerencia o necesitas ayuda con la aplicación?
                            ¡Estamos aquí para ayudarte! Completa el formulario o usa nuestros datos de contacto.
                        </p>
                    </div>
                </section>

                <div className="row g-5">
                    <div className="col-12 col-lg-6">
                        <h2 className="mb-4">Envíanos un Mensaje</h2>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="tuemail@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="subject" className="form-label">Asunto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="subject"
                                    placeholder="¿En qué podemos ayudarte?"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Mensaje</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    rows="4"
                                    placeholder="Escribe tu mensaje aquí"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>

                    <div className="col-12 col-lg-6">
                        <h2 className="mb-4">Información de Contacto</h2>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">Estamos a tu disposición</h5>
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <strong>Email:</strong>
                                        <a href="mailto:soporte@menuapp.com" className="text-decoration-none"> soporte@alpuntoapp.com</a>
                                    </li>
                                    <li className="mb-3">
                                        <strong>Teléfono:</strong> +1 (555) 123-4567
                                    </li>
                                    <li className="mb-3">
                                        <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00
                                    </li>
                                    <li>
                                        <strong>Dirección:</strong> 123 Calle Sabor, Ciudad Gourmet, CP 45678
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;