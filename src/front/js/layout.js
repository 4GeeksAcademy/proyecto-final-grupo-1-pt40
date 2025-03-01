import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import MenuBuilder from "./pages/MenuBuilder.jsx";
import SignUpPage from './pages/SignUpPage.jsx';
import ClientDashboard from "./pages/ClientDashboard.jsx";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import LoginPage from "./pages/LoginPage.jsx";
import MenuView from "./pages/MenuView.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import RestaurantProfile from "./pages/RestaurantProfile.jsx";
import RestaurantForm from "./pages/RestaurantForm.jsx";
import FavoritePage from "./pages/FavoritePage.jsx";
import EditRestaurantForm from "./component/EditRestaurantForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>

                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SignUpPage />} path="/signup" />
                        <Route element={<LoginPage />} path="/login" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<MenuBuilder />} path="/menu-builder/:menuID" />
                        <Route element={<MenuView />} path="/menu/:menuID" />
                        <Route element={<ClientDashboard />} path="/client-dashboard" />
                        <Route element={<AdminDashboard />} path="/admin-dashboard" />
                        <Route element={<FavoritePage />} path="/favorites" />
                        <Route element={<RestaurantDashboard />} path="/restaurant-dashboard" />
                        <Route element={<RestaurantForm />} path="/restaurant-form" />
                        <Route element={<RestaurantProfile />} path="/restaurant-profile/:restaurantId" />
                        <Route path="/edit-restaurant/:restaurantId" element={<EditRestaurantForm />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>

                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
