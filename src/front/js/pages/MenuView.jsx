import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Card } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { Context } from "../store/appContext";


const MenuView = () => {
    const { restaurantID } = useParams();
    const { store, actions } = useContext(Context);
    const [menu, setMenu] = useState(null)
    const [dishes, setDishes] = useState(null)

    useEffect(() => {
        const loadMenu = async () => {
            const success = await actions.getMenuByRestaurant(restaurantID);
            if (success) {
                setMenu(store.menu);
            }
        };
        loadMenu();
    }, [restaurantID, store.menu]);

    return (
        <div>
            {menu && dishes ? (
                <>
                    <h1>{menu.name}</h1>
                    {menu.categories.length > 0 ? (
                        <Tabs defaultActiveKey={menu.categories[0]} id="fill-tab-example" className="mb-3" fill>
                            {menu.categories.map((cat) => (
                                <Tab eventKey={cat} title={cat} key={cat}>
                                    {
                                        dishes[cat].length > 0 ? (
                                            dishes[cat].map((dish, index) => (
                                                <Card key={index} style={{ width: "18rem" }} className="m-2">
                                                    <Card.Img variant="top" src={dish.image} />
                                                    <Card.Body>
                                                        <Card.Title>{dish.name}</Card.Title>
                                                        <Card.Text>{dish.description}</Card.Text>
                                                        <Card.Text><strong>Precio:</strong> {dish.price}</Card.Text>
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
