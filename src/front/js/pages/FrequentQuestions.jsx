import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import MainNavbar from '../component/MainNavbar.jsx';

const FrequentQuestions = () => {
    return (
        <div>
            <MainNavbar />
            <div className="container my-5">
                <h1 className="text-center mb-4">Preguntas Frecuentes</h1>

                <section className="row justify-content-center mb-4">
                    <div className="col-12 col-md-8 text-center">
                        <p className="lead">
                            Aquí respondemos las dudas más comunes que tienen nuestros clientes sobre cómo usar
                            la aplicación para explorar menús y disfrutar de sus restaurantes favoritos.
                        </p>
                    </div>
                </section>

                <section className="accordion" id="faqAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                            >
                                1. ¿Cómo encuentro restaurantes cerca de mí?
                            </button>
                        </h2>
                        <div
                            id="collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Solo tienes que activar la ubicación en tu dispositivo y la aplicación te mostrará
                                automáticamente los restaurantes cercanos. También puedes buscar manualmente por
                                ciudad o tipo de comida.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                            >
                                2. ¿Puedo ver el menú antes de ir al restaurante?
                            </button>
                        </h2>
                        <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                ¡Sí! Todos los menús subidos por los restaurantes están disponibles para que los explores,
                                incluyendo fotos, descripciones y precios, para que decidas qué probar antes de llegar.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                            >
                                3. ¿Es gratis usar la aplicación?
                            </button>
                        </h2>
                        <div
                            id="collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Sí, para los clientes es completamente gratis. Solo necesitas descargar la aplicación
                                y empezar a explorar. Los restaurantes pueden tener planes de suscripción para funciones
                                avanzadas.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFour"
                                aria-expanded="false"
                                aria-controls="collapseFour"
                            >
                                4. ¿Cómo sé si el menú está actualizado?
                            </button>
                        </h2>
                        <div
                            id="collapseFour"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFour"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Los restaurantes actualizan sus menús en tiempo real. Si algo no está disponible,
                                lo verás reflejado inmediatamente en la aplicación.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFive"
                                aria-expanded="false"
                                aria-controls="collapseFive"
                            >
                                5. ¿Puedo guardar mis restaurantes favoritos?
                            </button>
                        </h2>
                        <div
                            id="collapseFive"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFive"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Claro, puedes guardar cualquier restaurante en tu lista de favoritos para acceder
                                rápidamente a sus menús cuando quieras.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FrequentQuestions;