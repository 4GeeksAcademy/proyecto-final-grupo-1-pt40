import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Container, Row, Col, Badge, Nav, Stack } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { Context } from "../store/appContext";
import GoogleMapsModal from "../component/GoogleMapsModal.jsx";
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import "../../styles/menu-view.css"



const MenuView = () => {
    const { menu_id } = useParams();
    const { store, actions } = useContext(Context);
    const [menu, setMenu] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [selected, setSelected] = useState('')


    const onLoad = async () => {
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
            setSelected(catID)
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
        <div>
            <RestaurantNavbar />
            <Container fluid>
                <Row className="w-25">
                    <div className={menu.is_active ? ('bg-success') : ('bg-danger')}>
                        <span className="fs-5"><strong>Estatus:</strong> {`${menu.is_active ? ('PÚBLICO') : ('PRIVADO')}`}</span>
                    </div>
                </Row>

                <Row className="w-100 h-100">
                    <Col xs md lg="4" className="justify-content-start h-100">
                        <Card className="w-100 shadow">
                            {dishes && restaurant && menu ?
                                (<>
                                    <Card.Img variant="top" src={restaurant.image} />
                                    <Card.Body>
                                        <Card.Title className="fs-2 fw-bold mt-2 text-center">{restaurant.name}</Card.Title>
                                        <Card.Subtitle className="d-flex justify-content-around mt-3"> <Badge  className="py-2 px-4 text-dark gray-button align-items-center align-middle fs-6">{restaurant.cuisine_type}</Badge> <GoogleMapsModal addressLink={restaurant.social_networks} /></Card.Subtitle>
                                        <Card.Text className="mt-2 fs-5">
                                            
                                            <strong>Dirección: </strong>{`${restaurant.exact_address}${restaurant.city}, ${restaurant.department}`} </Card.Text>
                                        <Card.Text className="mt-2 fs-5">
                                            <strong>Teléfono: </strong>
                                            {`${restaurant.phone}`} </Card.Text>

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
                        <Row className="sticky-top py-2 w-100">
                            {menu && dishes && menu.categories && menu.categories.length > 0 ? (
                                <Nav variant="pills" className="mb-3 bg-white shadow p-3 rounded">
                                    {menu.categories.map((cat, index) => (
                                        <Nav.Item key={index} className="mx-2">
                                            <Button className={selected===cat? "orange-button fs-5": "gray-button fs-5"} onClick={() => handleScroll(cat)}>{cat}</Button>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            ) : (
                                <div>Sin categorias</div>
                            )}

                        </Row>

                        <Row className="mt-1 g-0 w-100 px-3 d-flex justify-content-center">
                            {dishes && menu && menu.categories && menu.categories.length > 0 ? (
                                    menu.categories.map((cat, index) => (
                                        <React.Fragment key={index}>
                                            <div id={cat}>
                                                <h3 className="my-2">{cat}</h3>
                                            </div>

                                            {Array.isArray(dishes[cat]) && dishes[cat].length > 0 ? (
                                                dishes[cat].map((dish, dishIndex) => (
                                                    <Card className="my-2 menu-builder-dish-card" key={dishIndex}>
                                                        <Row className="w-100 h-100 m-0">
                                                            {dish.image &&
                                                                <Col xs='12' md='4' lg='4' className="p-0 m-0 ">
                                                                    <Card.Img src={dish.image} alt='Sin imagen' className="menu-builder-img m-auto" />
                                                                </Col>
                                                            }
                                                            <Col xs="12" md={dish.image ? "6" : "10"} lg={dish.image ? "8" : "10"} className="m-auto h-100 ">
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
                                    ))
                           
                            ) : (
                                <div>Menu sin elementos</div>
                            )}

                        </Row>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default MenuView;
