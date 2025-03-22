import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Container } from 'react-bootstrap'
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import { Widget } from "@uploadcare/react-widget";
import { useNavigate } from "react-router-dom";
import "../../styles/restaurant-dashboard.css"

const RestaurantNewsForm = () => {
    const { store, actions } = useContext(Context);
    const [newsData, setNewsData] = useState({
        title: "",
        description: "",
        image: "",
        category: "",
        expirationDate: ""
    });
    const [widgetKey, setWidgetKey] = useState(1)
    const [edit, setEdit] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigateTo = useNavigate()
    const handleChange = (e) => {
        setNewsData({
            ...newsData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (file) => {
        setNewsData({ ...newsData, image: file.cdnUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Datos enviados al backend:", newsData);

        try {
            setSuccessMessage("");
            setErrorMessage("");
            await actions.createRestaurantNews(newsData);
            setSuccessMessage("¡La publicación se ha creado exitosamente!");
            setNewsData({ title: "", description: "", category: "", image: "", expirationDate: "" , expiration_date:""});
            setWidgetKey(prev => 1 + prev)
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);

        } catch (error) {

            setErrorMessage("Ocurrió un error al crear la publicación. Por favor intente nuevamente.");
            console.error("Error al crear la noticia:", error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setSuccessMessage("");
            setErrorMessage("");
            await actions.editRestaurantNews(newsData.id, newsData);
            setSuccessMessage("¡La publicación se ha actualizado exitosamente!");
            setEdit(false)
            setTimeout(() => {
                setSuccessMessage("");
                navigateTo("/restaurant-dashboard")
            }, 4000);

        } catch (error) {
            setErrorMessage("Ocurrió un error al actualizar la publicación. Por favor intente nuevamente.");
            console.error("Error al actualizar la noticia:", error);
        }
    };

    const checkEdit = () => {
        if (Object.keys(store.editNews).length === 0) {
        } else {
            setEdit(true)
            setNewsData(store.editNews)
            console.log(store.editNews)
        }
    }
    useEffect(() => {
        checkEdit()
    }, [])

    return (
        <>
            <RestaurantNavbar />

            <Container fluid>
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 border rounded">
                    <h3 className="mb-3 text-orange fw-bold">
                        {edit ? "EDITAR NOVEDAD" : "PUBLICAR NOVEDAD"}
                    </h3>

                    <input type="text" name="title" value={newsData.title} onChange={handleChange} placeholder="Título de la publicación" className="form-control form-input mb-2" required />
                    <select name="category" value={newsData.category} onChange={handleChange} className="form-control mt-3 bg-gray input-form" required>
                        <option value="">Seleccionar una categoría categoría</option>
                        <option value="Descuentos">Descuentos</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Alertas">Alertas</option>
                    </select>
                    <textarea name="description" value={newsData.description} onChange={handleChange} placeholder="Describe el evento, promoción o alerta" className="form-control form-input mt-3" required />
                    <div className="row d-flex align-items-center justify-content-start mt-3">
                        <div className="col-auto ">
                            <label className="fw-bold">Fecha de Expiración:</label>
                        </div>
                        <div className=" col-auto">
                            <input type="date" name={edit ? "expiration_date" : "expirationDate"} value={edit ? newsData.expiration_date : newsData.expirationDate} onChange={handleChange} className="form-control mb-2 form-input" required />
                        </div>
                    </div>
                    <div className="row d-flex mt-3 align-items-center justify-content-start">
                        <div className="col-auto">
                            <label className="fw-bold">Imagen de Presentación:</label>
                        </div>
                        <div className=" col-auto">
                            <Widget publicKey="47bd03853371888b5541" value={newsData.image} key={widgetKey} onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4 w-100">
                        {edit ? <button type="submit" onClick={handleEdit} className="btn gray-button fw-bold fs-5 d-inline-block">Editar</button> : <button type="submit" className="btn gray-button fw-bold fs-5 d-inline-block">Publicar</button>}
                    </div>
                </form>

            </Container>
        </>
    );
};

export default RestaurantNewsForm;