import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { useParams } from 'react-router-dom';

function MenuNavigation({ username, menus, selected }) {
    const navigateTo = useNavigate()
    const { menu_id, restaurant_username } = useParams();
    const [activeMenu, setActiveMenu] = useState(menu_id);

    useEffect(() => {
        setActiveMenu(menu_id);
    }, [menu_id]);

    return (
        <Nav variant='tabs' className='overflow-auto flex-nowrap'
        style={{ whiteSpace: "nowrap" }}
>
            {menus?.map((menu, menuIndex) => (
                <Nav.Item key={menu.menu_id} >
                    <Nav.Link onClick={() => {
                        navigateTo(`/restaurant/${username}/menu/${menu.menu_id}`)
                    }} className={menu.menu_id.toString() === activeMenu ? 'orange-button text-white fs-5 fw-bold' : 'gray-button text-dark fs-6 fw-bold'}>{menu.name}</Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
}

export default MenuNavigation;