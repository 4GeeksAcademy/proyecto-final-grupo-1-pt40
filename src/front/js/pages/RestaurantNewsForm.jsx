import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import { Widget } from "@uploadcare/react-widget";

const RestaurantNewsForm = () => {
    const { actions } = useContext(Context);
    const [newsData, setNewsData] = useState({
        title: "",
        description: "", 
        image: "",
        category: "",
        expirationDate: ""
    });
        
        const [successMessage, setSuccessMessage] = useState("");
        
        const [errorMessage, setErrorMessage] = useState("");
    
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
            
           
            setNewsData({ title: "", description: "", category: "", image: "", expirationDate: "" });
            
            
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
            
        } catch (error) {
            
            setErrorMessage("Ocurrió un error al crear la publicación. Por favor intente nuevamente.");
            console.error("Error al crear la noticia:", error);
        }
    };
    
    return (
        <div>
            <RestaurantNavbar />
            
            
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
                <h3 className="mb-3">Publicar Novedad</h3>
                <input type="text" name="title" value={newsData.title} onChange={handleChange} placeholder="Título" className="form-control mb-2" required />
                <textarea name="description" value={newsData.description} onChange={handleChange} placeholder="Descripción" className="form-control mb-2" required />
                <select name="category" value={newsData.category} onChange={handleChange} className="form-control mb-2" required>
                    <option value="">Seleccionar categoría</option>
                    <option value="Descuentos">Descuentos</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Alertas">Alertas</option>
                </select>
                <input type="date" name="expirationDate" value={newsData.expirationDate} onChange={handleChange} className="form-control mb-2" required />
                <Widget publicKey="47bd03853371888b5541" onChange={handleFileChange} className="mb-2" />
                <button type="submit" className="btn btn-primary w-100">Publicar</button>
            </form>
        </div>
    );
};

export default RestaurantNewsForm;