import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Card, Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { Context } from "../store/appContext";
import FavoriteButton from "../component/FavoriteButton.jsx"


const MenuView = () => {
    const { menuID } = useParams();
    const { store, actions } = useContext(Context);
    const [menu, setMenu] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [like, setLike] = useState(false)

    const onLoad = async () => {
        const response = await actions.menuViewLoad(menuID)
        if (response) {
            setMenu(store.menu.menu)
            console.log(store.menu.menu)
            setDishes(store.menu.dishes)
        }
    }

    useEffect(() => {
        onLoad()
    }, []);

    return (
        <div>
            {menu && dishes ? (
                <>
                    <h1 className="d-flex justify-content-center">{menu.name}</h1>
                    {menu.categories.length > 0 ? (
                        <Tabs defaultActiveKey={menu.categories[0]} id="fill-tab-example" className="mb-3" fill>
                            {menu.categories.map((cat) => (
                                <Tab eventKey={cat} title={cat} key={cat}>
                                    {
                                        Array.isArray(dishes[cat]) ? (
                                            dishes[cat].map((dish, index) => (
                                                <Card key={index} style={{ width: "200px", height: "340px" }} className="m-2 d-flex">
                                                    <Card.Img variant="top" src={dish.image}
                                                        style={{ width: '100%', height: '200px' }} />
                                                    <Card.Body>
                                                        <Card.Title>{dish.name}</Card.Title>
                                                        <Card.Text>{dish.description}</Card.Text>
                                                        <Card.Text><strong>Precio:</strong> {`${dish.price} ${menu.currency}`}</Card.Text>
                                                        
                                                        {store.client?.client_id &&<FavoriteButton dish_id={dish.dish_id} />}
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        ) : ( 
                                            'No hay platillos en esta categoria'
                                        )
                                    }
                                </Tab>
                            ))}
                        </Tabs>
                    ) : (
                        <Tabs defaultActiveKey="profile" id="fill-tab-example" className="mb-3" fill>
                            <Tab eventKey='platillos' title='Platillos' key='sincategorias'>
                                No hay platillos en este menu
                            </Tab>
                        </Tabs>
                    )}
                </>
            ) : (
                <Spinner animation="border" variant="danger" />
            )}
        </div>
    );
};

export default MenuView;
