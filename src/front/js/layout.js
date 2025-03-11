import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import MenuBuilder from "./pages/MenuBuilder.jsx";
import MenuPublicView from "./pages/MenuPublicView.jsx"
import SignUpPage from './pages/SignUpPage.jsx';
import ClientDashboard from "./pages/ClientDashboard.jsx";
import { Home } from "./pages/home";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import LoginPage from "./pages/LoginPage.jsx";
import MenuView from "./pages/MenuView.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import RestaurantProfile from "./pages/RestaurantProfile.jsx";
import RestaurantForm from "./pages/RestaurantForm.jsx";
import FavoritePage from "./pages/FavoritePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RestaurantProfileEdit from "./pages/RestaurantProfileEdit.jsx";
import RestaurantPurchasePlan from "./pages/RestaurantPurchasePlan.jsx";
import ClientProfileEdit from "./pages/ClientProfileEdit.jsx";



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
                        <Route element={<MenuPublicView />} path="/restaurant/:restaurant/:menuID" />


                        <Route element={<MenuView />} path="/menu/:menuID" />

                        <Route element={<ClientDashboard />} path="/client-dashboard" />
                        <Route element={<FavoritePage />} path="/favorites" />

                        <Route element={<AdminDashboard />} path="/admin-dashboard" />

                        <Route element={<RestaurantDashboard />} path="/restaurant-dashboard" />
                        <Route element={<MenuBuilder />} path="/menu-builder/:menuID" />
                        <Route element={<RestaurantForm />} path="/restaurant-form" />
                        <Route element={<RestaurantProfile />} path="/restaurant-profile" />
                        <Route element={<RestaurantProfileEdit />} path="/edit-restaurant" />
                        <Route element={<RestaurantPurchasePlan />} path="/plan-purchase" />
                        <Route element={<ClientProfileEdit />} path="/edit-client" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>

                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
