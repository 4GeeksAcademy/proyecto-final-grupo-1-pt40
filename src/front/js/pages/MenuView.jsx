import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Container, Row, Col, Badge, Nav, Stack, Offcanvas } from "react-bootstrap";
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
    const [showDetails, setShowDetails] = useState(false); 

    const handleShow = () => setShowDetails(true);
    const handleClose = () => setShowDetails(false);
  

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
                <Row className="w-100 text-center d-flex justify-content-center my-2">
                    <div className={menu.is_active ? ('bg-orange py-2') : ('bg-gray py-2')}>
                        <span className="fs-5"><strong>Estatus:</strong> {`${menu.is_active ? ('PÚBLICO') : ('PRIVADO')}`}</span>
                    </div>
                </Row>

                <Row className="w-100 h-100">
                    <Col xs='12' md='4' lg="4" className="justify-content-start h-100 d-none d-md-block">
                        <Card className="w-100 shadow">
                            {dishes && restaurant && menu ?
                                (<>
                                    <Card.Img variant="top" src={restaurant.image} className="menu-view-card-img"/>
                                    <Card.Body>
                                        <Card.Title className="fs-2 fw-bold mt-2 text-center">{restaurant.name}</Card.Title>
                                        <Card.Subtitle className="d-flex justify-content-around mt-3"> <Badge className="py-2 px-4 text-dark gray-button align-items-center align-middle fs-6">{restaurant.cuisine_type}</Badge></Card.Subtitle>
                                        <Card.Subtitle className="d-flex justify-content-center text-center mt-3">{restaurant.description}</Card.Subtitle>
                                        <Card.Text className="mt-2 d-flex fs-6 text-center justify-content-center">
                                            {`${restaurant.exact_address} ${restaurant.city}, ${restaurant.department}`} </Card.Text>
                                        <Card.Text className="fs-6 text-center">
                                            Telf.
                                            {`${restaurant.phone}`} </Card.Text>
                                        <Card.Text className="d-flex justify-content-center"><GoogleMapsModal addressLink={restaurant.social_networks} /></Card.Text>

                                        <div className="fs-6 mt-3">
                                            <table className="table table-borderless text-left">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "30%" }}>Día</th>
                                                        <th style={{ width: "70%" }}>Horario</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {restaurant.schedule.map((day, index) => (
                                                        <tr key={index} style={{ marginBottom: "2px" }}>
                                                            <td>{day.day}</td>
                                                            <td>{day.isClosed ? "Cerrado" : `${convertToAmPm(day.open)} - ${convertToAmPm(day.close)}`}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card.Body></>)

                                : (<Card.Body>
                                    <Card.Title>Cargando ....</Card.Title>
                                </Card.Body>)

                            }
                        </Card>

                    </Col>

                    <Col xs="12" className="d-block d-md-none">
                        <Button
                            variant="primary"
                            className="w-100 mb-3 mt-3 gray-button"
                            onClick={handleShow}
                        >
                            Ver Restaurante
                        </Button>

                        <Offcanvas show={showDetails} onHide={handleClose} placement="start">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title className="text-orange fw-bold">INFORMACIÓN</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                            <Card className="w-100 shadow">
                            {dishes && restaurant && menu ?
                                (<>
                                    <Card.Img variant="top" src={restaurant.image} />
                                    <Card.Body>
                                        <Card.Title className="fs-2 fw-bold mt-2 text-center">{restaurant.name}</Card.Title>
                                        <Card.Subtitle className="d-flex justify-content-around mt-3"> <Badge className="py-2 px-4 text-dark gray-button align-items-center align-middle fs-6">{restaurant.cuisine_type}</Badge></Card.Subtitle>
                                        <Card.Subtitle className="d-flex justify-content-center text-center mt-3">{restaurant.description}</Card.Subtitle>
                                        <Card.Text className="mt-2 d-flex fs-6 text-center justify-content-center">
                                            {`${restaurant.exact_address} ${restaurant.city}, ${restaurant.department}`} </Card.Text>
                                        <Card.Text className="fs-6 text-center">
                                            Telf.
                                            {`${restaurant.phone}`} </Card.Text>
                                        <Card.Text className="d-flex justify-content-center"><GoogleMapsModal addressLink={restaurant.social_networks} /></Card.Text>

                                        <div className="fs-6 mt-3">
                                            <table className="table table-borderless text-left">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "30%" }}>Día</th>
                                                        <th style={{ width: "70%" }}>Horario</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {restaurant.schedule.map((day, index) => (
                                                        <tr key={index} style={{ marginBottom: "2px" }}>
                                                            <td>{day.day}</td>
                                                            <td>{day.isClosed ? "Cerrado" : `${convertToAmPm(day.open)} - ${convertToAmPm(day.close)}`}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card.Body></>)

                                : (<Card.Body>
                                    <Card.Title>Cargando ....</Card.Title>
                                </Card.Body>)

                            }
                        </Card>
                            </Offcanvas.Body>


                        </Offcanvas>

                    </Col>

                    <Col xs='12' md='8' lg="8">
                        <Row className="sticky-top py-2 w-100 d-flex justify-content-center mx-0 px-0">
                            {menu && dishes && menu.categories && menu.categories.length > 0 ? (
                                <Nav variant="pills" className="mb-3 bg-white shadow p-3 rounded overflow-auto flex-nowrap w-100"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    {menu.categories.map((cat, index) => (
                                        <Nav.Item key={index} className="mx-2">
                                            <Button className={selected === cat ? "orange-button fs-6" : "gray-button fs-6"} onClick={() => handleScroll(cat)}>{cat}</Button>
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
                                                <Card className="my-2 menu-builder-dish-card d-flex" key={dishIndex}>
                                                    <Row className="w-100 m-0 gx-0">
                                                        {dish.image &&
                                                            <Col xs='12' md='3' lg='3' className="p-0 m-0">
                                                                <Card.Img src={dish.image} alt='Sin imagen' className="menu-builder-img m-auto" />
                                                            </Col>
                                                        }
                                                        <Col xs="12" md={dish.image ? "8" : "10"} lg={dish.image ? "8" : "10"} className="m-0 p-0 h-100 ">
                                                            <Card.Body>
                                                                <Card.Title>{dish.name}</Card.Title>
                                                                        <Card.Text >{dish.description}</Card.Text>
                                                                        <Card.Text><strong>Precio:</strong>{` ${dish.price} ${menu.currency}`}</Card.Text>
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
