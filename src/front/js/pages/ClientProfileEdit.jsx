import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Form, Button } from "react-bootstrap";
import ClientNavbar from "../component/ClientNavbar.jsx";
import "../../styles/ClientProfileEdit.css"; 

const ClientProfileEdit = () => {
  const { store, actions } = useContext(Context);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  const [registration, setRegistration] = useState({
    email: "",
    username: "",
    password: "", // For updating password
    department: "",
    city: "",
  });

  const navigate = useNavigate();

  const onLoad = async () => {
    try {
      // Fetch client details (assumes an action exists)
      const client = await actions.getClientDetails(); // Replace with your actual action
      const departments = await actions.getDepartments();
      setDepartments(departments);

      // Assuming client.department is a string, find matching department and load cities
      const selection = departments.find((dep) => dep.name === client.department);
      if (selection) {
        const cities = await actions.getCities(selection.id);
        setCities(cities);
        setRegistration({
          email: client.email || "",
          username: client.username || "",
          password: "", // Leave blank initially; user fills if updating
          department: client.department || "",
          city: client.city || "",
        });
      } else {
        console.error("Department not found");
        setRegistration({
          email: client.email || "",
          username: client.username || "",
          password: "",
          department: "",
          city: "",
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleRegister = (event) => {
    const { name, value } = event.target;
    setRegistration((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDepartment = async (event) => {
    const { value, selectedIndex } = event.target;
    if (value) {
      const selectedDepartment = event.target.options[selectedIndex].text;
      setRegistration((prevState) => ({
        ...prevState,
        department: selectedDepartment,
        city: "", // Reset city when department changes
      }));
      const cities = await actions.getCities(value); // Assuming value is the department ID
      setCities(cities);
    }
  };

  const handleSelectCity = (event) => {
    const { selectedIndex } = event.target;
    const selectedCity = event.target.options[selectedIndex].text;
    setRegistration((prevState) => ({ ...prevState, city: selectedCity }));
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    // Only send password if it’s updated (not empty)
    const dataToSend = { ...registration };
    if (!dataToSend.password) {
      delete dataToSend.password; // Avoid sending empty password
    }
    const response = await actions.updateClient(dataToSend); // Replace with your actual action
    if (response) navigate(`/client-dashboard`); // Adjust the redirect path as needed
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <ClientNavbar />
      <div className="client-profile-edit-page">
        <div className="client-profile-edit-container">
          <h2 className="client-profile-edit-title">EDITAR PERFIL</h2>
          <Form className="client-profile-edit-form" onSubmit={handleSubmission}>
            <Form.Group className="mb-3" controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={registration.email}
                name="email"
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escoge tu nombre de usuario"
                value={registration.username}
                name="username"
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Location">
              <Form.Label>Ubicación</Form.Label>
              <Form.Select
                aria-label="Departments"
                onChange={handleDepartment}
                value={
                  departments.find((dep) => dep.name === registration.department)?.id || ""
                }
                className="mb-2"
              >
                <option value="">Selecciona un departamento</option>
                {departments?.map((dep, index) => (
                  <option key={index} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                aria-label="Cities"
                onChange={handleSelectCity}
                disabled={cities.length === 0}
                value={cities.find((city) => city.name === registration.city)?.id || ""}
              >
                <option value="">Selecciona una ciudad</option>
                {cities?.map((city, index) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button className="client-profile-edit-button" type="submit">
              ACTUALIZAR PERFIL
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileEdit;