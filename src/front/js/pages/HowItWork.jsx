import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import MainNavbar from '../component/MainNavbar.jsx';

const HowItWork = () => {
    return (
        <div>
            <MainNavbar />
            <div className="container my-5">
                <h1 className="text-center mb-4">¿Cómo Funciona Nuestra Aplicación?</h1>

                <section className="row justify-content-center mb-4">
                    <div className="col-12 col-md-8 text-center">
                        <p className="lead">
                            Nuestra aplicación conecta restaurantes con clientes de una manera simple y eficiente.
                            Los restaurantes pueden gestionar sus menús y los clientes pueden explorar opciones
                            deliciosas desde cualquier lugar.
                        </p>
                    </div>
                </section>

                <section className="row g-4">
                    <div className="col-12 col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">1. Para Restaurantes</h2>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Regístrate y crea tu perfil de restaurante</li>
                                    <li className="list-group-item">Sube tu menú con fotos, descripciones y precios</li>
                                    <li className="list-group-item">Actualiza tu menú en tiempo real cuando quieras</li>
                                    <li className="list-group-item">Gestiona tus platos disponibles según el día</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">2. Para Clientes</h2>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Explora restaurantes cercanos o busca por tipo de comida</li>
                                    <li className="list-group-item">Visualiza menús completos con imágenes</li>
                                    <li className="list-group-item">Filtra por precio, categoría o preferencias dietéticas</li>
                                    <li className="list-group-item">Guarda tus restaurantes favoritos para volver después</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">3. Conexión Perfecta</h2>
                                <p className="card-text">
                                    La aplicación hace que sea fácil para los restaurantes llegar a más clientes y para los
                                    clientes descubrir nuevas opciones gastronómicas, todo en una plataforma intuitiva.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row justify-content-center mt-5">
                    <div className="col-12 col-md-8 text-center">
                        <h3>¡Es así de simple!</h3>
                        <p>
                            Ya seas dueño de un restaurante o un amante de la comida, nuestra aplicación está diseñada
                            para hacer tu experiencia más fácil y agradable.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HowItWork;