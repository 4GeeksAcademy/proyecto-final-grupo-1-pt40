import React, { useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const Dashboard = () => {
  const [restaurantes, setRestaurantes] = useState([
    {
      id: 1,
      nombre: "Restaurante A",
      direccion: "Calle 123, Ciudad",
      telefono: "123-456-7890",
      imagen: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      nombre: "Restaurante B",
      direccion: "Avenida 456, Ciudad",
      telefono: "987-654-3210",
      imagen: "https://via.placeholder.com/150",
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [restauranteEditando, setRestauranteEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState("");

  const abrirModal = (editar = false, restaurante = null) => {
    if (editar && restaurante) {
      setNombre(restaurante.nombre);
      setDireccion(restaurante.direccion);
      setTelefono(restaurante.telefono);
      setImagen(restaurante.imagen);
      setRestauranteEditando(restaurante);
    } else {
      setNombre("");
      setDireccion("");
      setTelefono("");
      setImagen("");
      setRestauranteEditando(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const guardarRestaurante = () => {
    if (restauranteEditando) {
      const restaurantesActualizados = restaurantes.map((r) =>
        r.id === restauranteEditando.id
          ? {
              ...r,
              nombre,
              direccion,
              telefono,
              imagen: imagen || "https://via.placeholder.com/150",
            }
          : r
      );
      setRestaurantes(restaurantesActualizados);
    } else {
      const nuevoRestaurante = {
        id: restaurantes.length + 1,
        nombre,
        direccion,
        telefono,
        imagen: imagen || "https://via.placeholder.com/150",
      };
      setRestaurantes([...restaurantes, nuevoRestaurante]);
    }
    cerrarModal();
  };

  const eliminarRestaurante = (id) => {
    const restaurantesFiltrados = restaurantes.filter((r) => r.id !== id);
    setRestaurantes(restaurantesFiltrados);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Home
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-link nav-link position-relative">
                  <i className="bi bi-bell"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </button>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Perfil"
                    className="rounded-circle me-2"
                    style={{ width: "30px", height: "30px" }}
                  />
                  Admin
                </button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="/perfil">
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/cerrar-sesion">
                      Cerrar sesión
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Restaurantes</h1>
          <button
            onClick={() => abrirModal()}
            className="btn btn-primary"
          >
            + Agregar Restaurante
          </button>
        </div>

        <div className="row">
          {restaurantes.map((restaurante) => (
            <div key={restaurante.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={restaurante.imagen}
                  className="card-img-top"
                  alt={restaurante.nombre}
                />
                <div className="card-body">
                  <h5 className="card-title">{restaurante.nombre}</h5>
                  <p className="card-text">{restaurante.direccion}</p>
                  <p className="card-text">{restaurante.telefono}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() => abrirModal(true, restaurante)}
                      className="btn btn-warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarRestaurante(restaurante.id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar/editar restaurante */}
      {modalAbierto && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {restauranteEditando ? "Editar Restaurante" : "Agregar Restaurante"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={guardarRestaurante}
                  className="btn btn-primary"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;