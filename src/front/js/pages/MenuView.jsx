import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Card, Button, Container, Row, Col, Badge, Nav } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { Context } from "../store/appContext";
import GoogleMapsModal from "../component/GoogleMapsModal.jsx";


const MenuView = () => {
    const { menu_id } = useParams();
    const { store, actions } = useContext(Context);
    const [menu, setMenu] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [restaurant, setRestaurant] = useState(null)


    const onLoad = async () => {
        console.log('here')
        const response = await actions.menuViewLoad(menu_id)
        if (response) {
            setMenu(store.menu.menu)
            console.log(store.menu.menu)
            setDishes(store.menu.dishes)
            setRestaurant(store.menu.restaurant)
        }
    }

    const convertToAmPm = (time) => {
        if (!time) return "";
        const [hour, minute] = time.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`
    }

    const handleScroll = (catID) => {
        const scrollTo = document.getElementById(catID)
        if (scrollTo) {
            scrollTo.scrollIntoView({ "behavior": "smooth", "block": "start" })
        }
    }

    useEffect(() => {
        onLoad()
    }, []);


    if (!menu || !dishes || !restaurant) {
        return (
            <Container fluid>
                <Spinner animation="border" variant="danger" />
            </Container>
        )
    }

    return (
        <Container fluid className="m-1">
            <Row className="w-25">
                <div className={menu.is_active ? ('bg-success') : ('bg-danger')}>
                    <span className="fs-5"><strong>Estatus:</strong> {`${menu.is_active ? ('PÚBLICO') : ('PRIVADO')}`}</span>
                </div>
            </Row>
            <Row className="w-100 h-100">
                <Col xs md lg="5" className="justify-content-start h-100">
                    <Card className="w-100">
                        {dishes && restaurant && menu ?
                            (<>
                                <Card.Img variant="top" src={restaurant.image} />
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Subtitle> <Badge bg="light" className="p-3 text-dark">{restaurant.cuisine_type}</Badge> <GoogleMapsModal addressLink={restaurant.social_networks} /></Card.Subtitle>
                                    <Card.Text>{`${restaurant.exact_address}  ${restaurant.city}, ${restaurant.department}`} </Card.Text>

                                    {restaurant.schedule.map((day, index) => (
                                        <div className="p-0 m-0" key={index}>{`${day.day}: ${day.isClosed ? 'Cerrado' : `${convertToAmPm(day.open)} - ${convertToAmPm(day.close)}`}`}</div>
                                    ))}


                                </Card.Body></>)

                            : (<Card.Body>
                                <Card.Title>Cargando ....</Card.Title>
                            </Card.Body>)

                        }
                    </Card>

                </Col>
                <Col xs md lg="7">
                    <Row className="sticky-top py-2 w-100">
                        {menu && dishes && menu.categories && menu.categories.length > 0 ? (
                            <Nav variant="pills" className="mb-3 bg-white p-3 rounded">
                                {menu.categories.map((cat, index) => (
                                    <Nav.Item key={index} className="mx-2">
                                        <Button onClick={() => handleScroll(cat)}>{cat}</Button>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        ) : (
                            <div>Sin categorias</div>
                        )}

                    </Row>

                    <Row className="w-100">
                        {dishes && menu && menu.categories && menu.categories.length > 0 ? (
                            <Col style={{ height: '100vh', overflowY: 'auto' }}>
                                {menu.categories.map((cat, index) => (
                                    <React.Fragment key={index}>
                                        <div id={cat}>
                                            <h3 className="my-2">{cat}</h3>
                                        </div>
                                        {Array.isArray(dishes[cat]) && dishes[cat].length > 0 ? (
                                            dishes[cat].map((dish, dishIndex) => (
                                                <Card className="my-2" key={dishIndex}>
                                                    <Row className="w-100">
                                                        <Col md='4'>
                                                            <Card.Img variant="top" src={dish.image} alt='Sin imagen' style={{ 'width': '200px', 'height': '150px' }} />
                                                        </Col>
                                                        <Col md='7'>
                                                            <Card.Body>
                                                                <Card.Title>{dish.name}</Card.Title>
                                                                <Card.Text>{dish.description}</Card.Text>
                                                                <Card.Text><strong>Precio:</strong> {`${dish.price} ${menu.currency}`}</Card.Text>
                                                            </Card.Body>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            ))
                                        ) : (
                                            <div>No hay platillos en esta categoria</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Col>
                        ) : (
                            <div>Menu sin elementos</div>
                        )}

                    </Row>
                </Col>

            </Row>
        </Container>
    );
};

export default MenuView;
