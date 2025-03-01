import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import ScheduleSelector from "./ScheduleSelector.jsx";
import axios from "axios";
import { Widget } from "@uploadcare/react-widget";

const EditRestaurantForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    cuisine_type: "",
    exact_address: "",
    social_networks: "",
    phone: "",
    description: "",
    image: "",
    schedule: {
      week: { open: "10:00 AM", close: "08:00 PM" },
      weekend: { open: "11:00 AM", close: "08:00 PM" }
    }
  });

  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del restaurante
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const data = await actions.getRestaurantDetails(restaurantId);
        if (data) {
          let parsedSchedule = data.schedule;
          if (typeof data.schedule === "string") {
            try {
              parsedSchedule = JSON.parse(data.schedule);
            } catch (error) {
              console.error("Error al parsear el horario:", error);
            }
          }
          setFormData({
            ...data,
            schedule: parsedSchedule || {
              week: { open: "10:00 AM", close: "08:00 PM" },
              weekend: { open: "11:00 AM", close: "08:00 PM" }
            }
          });
          if (data.department) {
            setDepartmentName(data.department);
          }
          if (data.city) {
            setCityName(data.city);
          }
        } else {
          setError("No se encontraron datos del restaurante.");
        }
      } catch (err) {
        console.error("Error obteniendo datos:", err);
        setError("Error al cargar los datos del restaurante.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRestaurantData();
  }, [restaurantId]); 

  // Obtener lista de departamentos
  useEffect(() => {
    axios.get("https://api-colombia.com/api/v1/Department")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => console.error("Error al obtener departamentos:", error));
  }, []);

  // Obtener lista de ciudades según el departamento seleccionado
  useEffect(() => {
    if (departmentName && departments.length > 0) {
      const selectedDepartment = departments.find(dep => dep.name === departmentName);
      if (selectedDepartment) {
        axios.get(`https://api-colombia.com/api/v1/City?departmentId=${selectedDepartment.id}`)
          .then(response => {
            setCities(response.data);
          })
          .catch(error => console.error("Error al obtener ciudades:", error));
      }
    } else {
      setCities([]);
    }
  }, [departmentName, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartmentName = e.target.value;
    setDepartmentName(selectedDepartmentName);
    setCityName(""); // Resetear ciudad al cambiar de departamento
  };

  const handleCityChange = (e) => {
    setCityName(e.target.value);
  };

  const handleScheduleChange = (newSchedule) => {
    if (JSON.stringify(newSchedule) !== JSON.stringify(formData.schedule)) {
      setFormData(prev => ({ ...prev, schedule: newSchedule }));
    }
  };

  const handleFileChange = (file) => {
    if (file && file.cdnUrl) {
      setFormData(prevState => ({
        ...prevState,
        image: file.cdnUrl
      }));
    } else {
      console.error("Error: No se obtuvo una URL válida.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      department: departmentName,
      city: cityName
    };
    try {
      const success = await actions.updateRestaurant(restaurantId, formData, updatedData);
      if (success) {
        alert("Perfil actualizado con éxito");
        navigate(`/restaurant-profile/${restaurantId}`);
      } else {
        alert("Hubo un error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error actualizando el restaurante:", err);
      alert("Error al actualizar el perfil.");
    }
  };
  if (loading) return <div className="alert alert-info">Cargando datos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Editar Información del Restaurante</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre del Restaurante</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Departamento</label>
          <select className="form-control" value={departmentName} onChange={handleDepartmentChange} required>
            <option value="">Selecciona un departamento</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.name}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <select className="form-control" value={cityName} onChange={handleCityChange} required>
            <option value="">Selecciona una ciudad</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Horario de Atención</label>
          <ScheduleSelector value={formData.schedule} onChange={handleScheduleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de cocina</label>
          <input type="text" className="form-control" name="cuisine_type" value={formData.cuisine_type} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input type="text" className="form-control" name="exact_address" value={formData.exact_address} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Redes sociales</label>
          <input type="text" className="form-control" name="social_networks" value={formData.social_networks} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción del restaurante</label>
          <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen del Restaurante</label>
          <Widget publicKey="47bd03853371888b5541" onChange={handleFileChange} />
        </div>

        <button type="submit" className="btn btn-success">Actualizar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(`/restaurant-profile/${restaurantId}`)}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditRestaurantForm;
