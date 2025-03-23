import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Card, CardBody, CardImg, CardTitle, CardText, Button } from "reactstrap";
import ClientNavbar from "../component/ClientNavbar.jsx";
import { useNavigate } from "react-router-dom";


const News = () => {
    const { store, actions } = useContext(Context);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigateTo = useNavigate();

    useEffect(() => {
        actions.getNews();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredNews = store.news.filter((news) =>
        selectedCategory ? news.category === selectedCategory : true
    );

    const handleMenuClick = async (username) => {
        const response = await actions.getRestaurantMenusPublic(username);
        if (response && Array.isArray(response) && response.length > 0) {
            navigateTo(`/restaurant/${username}/menu/${response[0].menu_id}`);
        } else {
            alert("El restaurante no tiene menús disponibles o no está activo.");
        }
    };

    return (
        <div>
            <ClientNavbar />
            <div className="container mt-4">
                <h2 className="d-flex justify-content-center mb-4 fw-bold text-orange">Novedades en tu ciudad</h2>

                <div className="mb-3">
                    <select className="form-select" onChange={handleCategoryChange} value={selectedCategory}>
                        <option value="">Todas las categorías</option>
                        <option value="Descuentos">Descuentos</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Alertas">Alertas</option>
                    </select>
                </div>

                <div className="row">
                    {filteredNews.length > 0 ? (
                        filteredNews.map((item) => (
                            <div key={item.id} className="col-md-4 mb-3">
                                <Card className="restaurant-card shadow news-card">
                                    
                                    <CardBody>
                                        <CardTitle tag="h5" className="text-center fw-bold">
                                            {item.restaurant_name}
                                        </CardTitle>
                                    </CardBody>

                                    
                                    {item.image && <CardImg top src={item.image} alt="News image" className="news-card-img" />}

                                    
                                    <CardBody className="d-flex flex-column">
                                        <CardTitle tag="h5">{item.title}</CardTitle>
                                        <CardText
                                            style={{
                                                maxHeight: "80px",
                                                overflowY: "auto",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: "1.3em",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.content}
                                        </CardText>
                                    </CardBody>

                                    
                                    <div className="card-footer d-flex justify-content-between align-items-center">
                                        <Button className="menu-button hover-effect" onClick={() => handleMenuClick(item.restaurant_username)}>
                                            Ver Menú
                                        </Button>
                                        <div className="text-muted text-end">
                                            <small>Hasta:</small>
                                            <p className="fw-bold mb-0">
                                                {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : "Sin fecha"}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p>No hay novedades disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default News;