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
                <h2 className="mb-4">Novedades en tu ciudad</h2>

                
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
                                <Card className="shadow">
                                    <CardBody>
                                        
                                        <CardTitle tag="h5" className="text-center fw-bold">{item.restaurant_name}</CardTitle>
                                    </CardBody>
                                    {item.image && <CardImg top src={item.image} alt="News image" />}
                                    <CardBody>
                                        <CardTitle tag="h5">{item.title}</CardTitle>
                                        <CardText>{item.content}</CardText>

                                        
                                        <Button
                                            color="primary"
                                            onClick={() => handleMenuClick(item.restaurant_username)}
                                        >
                                            Ver menú
                                        </Button>

                                        
                                        <div className="mt-2 text-muted text-center">
                                            <small>Hasta:</small>
                                            <p className="fw-bold">
                                                {item.expiration_date ? new Date(item.expiration_date + "T00:00:00").toLocaleDateString() : "Sin fecha"}
                                            </p>
                                        </div>
                                    </CardBody>
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