import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Context } from "../store/appContext";
import { Widget } from "@uploadcare/react-widget";
import EditModal from "../component/EditModal.jsx"
import { useParams } from 'react-router-dom';




const MenuBuilder = () => {
  const { menuID } = useParams();
  const { store, actions } = useContext(Context);
  const [widgetKey, setWidgetKey] = useState(1)
  const [categories, setCategories] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "", image: null });
  const [loaded, setLoaded] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const onLoad = async () => {
    if(!menuID){
      console.error("Error:menuID es undefined");
      return;
    }
     if (await actions.menuBuilderLoad(menuID)) {
      setLoaded(true);
      setCategories(store.menuBuilder.menu.categories);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const saveCategoryName = (oldName) => {
    if (!editedCategoryName.trim()) return; 

    const oldCategories = [...categories];
    const updatedCategories = categories.map(cat =>
      cat === oldName ? editedCategoryName : cat
    );

    
    
    console.log("Enviando a menuBuilderCategories:", {
      menuID,
      updatedCategories,
      oldCategories
    });
    
    actions.menuBuilderCategories(menuID, updatedCategories, oldCategories);
    
    setCategories(updatedCategories); 
    setEditingCategory(null); 
  };

  const cancelEditing = () => {
    setEditingCategory(null); 
    setEditedCategoryName(""); 
  };


  const updateCategories = async (oldCats = null) => {
    if (oldCats) {
      console.log("Enviando categorías antiguas:", oldCats);
      console.log("Enviando categorías nuevas:", categories);
      await actions.menuBuilderCategories(menuID, categories, oldCats);
    } else {
      
      await actions.menuBuilderCategories(menuID, categories);
    }
  }

  const addCategory = async () => {
    if (!newCategory || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const removeCategory = async (category) => {
    setCategories(categories.filter(cat => cat !== category));
    if (selectedCategory === category) setSelectedCategory(null);
  };


  const addDish = async () => {
    if (newDish.name && newDish.price && selectedCategory) {
      await actions.menuBuilderAddDish(menuID, newDish, selectedCategory)
      setNewDish({ name: "", description: "", price: "", category: "", image: null });
      setWidgetKey(prev => prev + 1)
    }
  };

  const handleFileChange = (file) => {
    setNewDish({ ...newDish, image: file.cdnUrl })
  }

  const removeDish = async (menuID, dishID, category) => {
    console.log("Intentando eliminar:", { menuID, dishID, category });
    if (!dishID || !menuID || !category) {
      console.error("Error: Falta un parámetro", { menuID, dishID, category });
      return;
    }
    await actions.menuBuilderDeleteDish(dishID, category);
  };
  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (loaded && !editingCategory) updateCategories();
  }, [categories, editingCategory])

  useEffect(() => {
    setNewDish({ name: "", description: "", price: "", category: "", image: null })
    setWidgetKey(prev => 1 + prev)
  }, [selectedCategory])

  return (
    <div className="d-flex">
      {Object.keys(store.menuBuilder).length > 0 && store.menuBuilder.menu.categories ? <div className="w-25 p-3 border-end">
        <h4>Categorías</h4>
        {store.menuBuilder.menu.categories.length > 0 ?
          (<ListGroup>
            {categories?.map((category, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {editingCategory === category ? (
                  <>
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="form-control"
                      style={{ width: "70%" }}
                    />
                    <div>
                      <Button variant="success" size="sm" onClick={() => saveCategoryName(category)}>✔️</Button>
                      <Button variant="secondary" size="sm" onClick={cancelEditing} className="ms-2">❌</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span onClick={() => setSelectedCategory(category)} style={{ cursor: "pointer" }}>{category}</span>
                    <div>
                      <Button variant="warning" size="sm" onClick={() => startEditing(category)}>🖊️</Button>
                      <Button variant="danger" size="sm" onClick={() => removeCategory(category)} className="ms-2">X</Button>
                    </div>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>) : (
            <div>No hay categorías en este momento</div>)}
        <Form.Control
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button className="mt-2" onClick={addCategory}>Agregar Categoría</Button>
      </div> : <Spinner animation="border" variant="danger" />}

      <div className="w-75 p-3">
        <h4>{selectedCategory ? `Agregar Platillo a ${selectedCategory}` : "Seleccione una categoría"}</h4>
        {selectedCategory && (
          <Form>
            <Form.Control
              type="text"
              placeholder="Nombre del Platillo"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            />
            <Widget publicKey='47bd03853371888b5541' onChange={handleFileChange} key={widgetKey} />
            <Form.Control
              as="textarea"
              placeholder="Descripción del Platillo"
              className="mt-2"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="Precio del Platillo"
              className="mt-2"
              value={newDish.price}
              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            />
            <Button className="mt-2" onClick={addDish}>Agregar Platillo</Button>
          </Form>
        )}

        <h4 className="mt-4">Platillos</h4>

        {selectedCategory && (<div>
          <div className="d-flex flex-wrap">
            {store.menuBuilder.dishes ? (
              Array.isArray(store.menuBuilder.dishes[selectedCategory]) ? (
                store.menuBuilder.dishes[selectedCategory]?.length > 0 ? (
                  store.menuBuilder.dishes[selectedCategory].map((dish, index) => (
                    <Card key={index} style={{ width: "18rem" }} className="m-2">
                      <Card.Img variant="top" src={dish.image} />
                      <Card.Body>
                        <Card.Title>{dish.name}</Card.Title>
                        <Card.Text>{dish.description}</Card.Text>
                        <Card.Text><strong>Precio:</strong> {`${dish.price} ${store.menuBuilder.menu.currency}`}</Card.Text>
                        <EditModal dish={dish} />
                        <Button variant="danger" size="sm" onClick={() => removeDish(menuID, dish.id, dish.category)}>
                          Eliminar
                        </Button>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>Aun no hay platillos en esta categoría</p>
                )
              ) : (
                <p>Aun no hay platillos en esta categoría</p>
              )
            ) : (
              <Spinner animation="border" variant="danger" />)}
          </div>
        </div>)}

      </div>
    </div>
  );
};

export default MenuBuilder;
