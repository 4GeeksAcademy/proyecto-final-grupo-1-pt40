import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col, Nav, Badge } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { Context } from "../store/appContext";
import GoogleMapsModal from "../component/GoogleMapsModal.jsx";


const MenuPublicView = () => {
    const { menu_id, restaurant_username } = useParams();
    const { store, actions } = useContext(Context);
    const [menu, setMenu] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [menuList, setMenuList] = useState(null)

    const onLoad = async () => {
        const response = await actions.menuViewLoad(menu_id)
        if (response) {
            setMenu(store.menu.menu)
            setDishes(store.menu.dishes)
            setRestaurant(store.menu.restaurant)
        }
    }

    const getMenuList = async () => {

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

    return (
        <Container className="m-5">
            <Row className="w-100 h-100">
                <Col xs md lg="4" className="justify-content-start">
                    <Card className="w-100">
                        {dishes && restaurant && menu ?
                            (<>
                                <Card.Img variant="top" src={restaurant.image} />
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Subtitle> <Badge bg="secondary" className="p-3">{restaurant.cuisine_type}</Badge> <GoogleMapsModal addressLink={restaurant.social_networks} /></Card.Subtitle>
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
                <Col xs md lg="8">
                    <Row className="sticky-top py-2">
                        {menu && dishes ? (
                            <Nav variant="pills" className="mb-3 bg-white p-3 rounded">
                                {menu.categories.map((cat, index) => (
                                    <Nav.Item key={index} className="mx-2">
                                        <Button onClick={() => handleScroll(cat)}>{cat}</Button>
                                    </Nav.Item>
                                ))}

                            </Nav>
                        ) : ('Cargando...')}
                    </Row>


                    <Row>

                        {dishes && menu ? (

                            <Col>
                                {menu.categories?.map((cat, index) => (

                                    <React.Fragment key={index}>
                                        <div id={cat}>
                                            <h3 className="my-2">{cat}</h3>
                                        </div>

                                        {dishes[cat]?.map((dish, dishIndex) => (
                                            <Card className="my-2" key={dishIndex}>
                                                <Row >
                                                    <Col md='4'>
                                                        <Card.Img variant="top" src={dish.image} alt='Sin imagen' style={{ 'width': '200px', "height": '150px' }} />
                                                    </Col>
                                                    <Col md='8'>
                                                        <Card.Body>
                                                            <Card.Title>{dish.name}</Card.Title>
                                                            <Card.Text>{dish.description}</Card.Text>
                                                            <Card.Text><strong>Precio:</strong> {`${dish.price} ${menu.currency}`}</Card.Text>
                                                        </Card.Body>
                                                    </Col>
                                                </Row>

                                            </Card>

                                        ))}
                                    </React.Fragment>

                                ))}


                            </Col>


                        ) : 'Cargando...'}


                    </Row>
                </Col>

            </Row>
        </Container>
    );
};

export default MenuPublicView;
