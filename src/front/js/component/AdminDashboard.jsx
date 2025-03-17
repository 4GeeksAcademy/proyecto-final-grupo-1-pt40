import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { Context } from "../store/appContext"

const Dashboard = () => {
  const { store, actions } = useContext(Context);
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

   // Obtener restaurantes al cargar el componente
   useEffect(() => {
    actions.getRestaurants();
  }, []);

  const fetchRestaurantes = async () => {
    try {
      const response = await fetch("https://upgraded-xylophone-69rw7996grgv3x4jw-3001.app.github.dev/");
      if (!response.ok) throw new Error("Error al obtener restaurantes");
      const data = await response.json();
      setRestaurantes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

    // Llama a fetchRestaurantes al cargar el componente
    useEffect(() => {
      fetchRestaurantes();
    }, []);

  const guardarRestaurante = async () => {
    const nuevoRestaurante = {
      nombre,
      direccion,
      telefono,
      imagen: imagen || "https://via.placeholder.com/150",
    };
  
    try {
      if (restauranteEditando) {
        // Si estamos editando, llama a actualizarRestaurante
        await actualizarRestaurante(restauranteEditando.id, nuevoRestaurante);
      } else {
        // Si estamos agregando, llama a agregarRestaurante
        await agregarRestaurante(nuevoRestaurante);
      }
      // Actualiza la lista de restaurantes después de guardar
      await fetchRestaurantes();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar el restaurante:", error);
    }
  };

  const agregarRestaurante = async (nuevoRestaurante) => {
    try {
      const response = await fetch("https://upgraded-xylophone-69rw7996grgv3x4jw-3000.app.github.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoRestaurante),
      });
      if (!response.ok) throw new Error("Error al agregar restaurante");
      const data = await response.json();
      setRestaurantes([...restaurantes, data]); // Actualiza el estado con el nuevo restaurante
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const actualizarRestaurante = async (id, datosActualizados) => {
    try {
      const response = await fetch(`https://upgraded-xylophone-69rw7996grgv3x4jw-3001.app.github.dev/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });
      if (!response.ok) throw new Error("Error al actualizar restaurante");
      const data = await response.json();
      setRestaurantes(
        restaurantes.map((r) => (r.id === id ? { ...r, ...data } : r))
      ); // Actualiza el estado
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const eliminarRestaurante = async (id) => {
    try {
      const response = await fetch(`https://upgraded-xylophone-69rw7996grgv3x4jw-3001.app.github.dev/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar restaurante");
      await fetchRestaurantes(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error:", error);
    }
  };

    return (
      <div className="min-vh-100 bg-light">

        {store.restaurants.map((restaurante) => (
        <div key={restaurante.id}>
          <h2>{restaurante.nombre}</h2>
          <p>{restaurante.direccion}</p>
        </div>
      ))}

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
                  <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                  </form>
                </li>
                <form className="form-inline my-2 my-lg-0 px-1">
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
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
            <button onClick={() => abrirModal()} className="btn btn-primary">
              + Agregar Restaurante
            </button>
          </div>
    
          <div className="row">
            {restaurantes.map((restaurante) => (
              <div key={restaurante.id} className="col-md-4 mb-4">
                <div className="card">
                  <img src={restaurante.imagen} className="card-img-top" alt={restaurante.nombre} />
                  <div className="card-body">
                    <h5 className="card-title">{restaurante.nombre}</h5>
                    <p className="card-text">{restaurante.direccion}</p>
                    <p className="card-text">{restaurante.telefono}</p>
                    <div className="d-flex justify-content-between">
                      <button onClick={() => abrirModal(true, restaurante)} className="btn btn-warning">
                        Editar
                      </button>
                      <button onClick={() => eliminarRestaurante(restaurante.id)} className="btn btn-danger">
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
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
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
                  <button type="button" onClick={guardarRestaurante} className="btn btn-primary">
                    Guardar
                  </button>
                  <button type="button" onClick={cerrarModal} className="btn btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Dashboard;