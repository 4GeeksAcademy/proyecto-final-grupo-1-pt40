"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from api.models import db, Client, Restaurant, Menu, Dish,Favorites,Admin
from flask import Flask, request, jsonify, url_for, Blueprint, Response,send_file
from werkzeug.utils import secure_filename
from sqlalchemy.exc import DataError
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity,get_jwt
from flask_jwt_extended import JWTManager
import json


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)




@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register/client', methods=['POST'])
def client_registration():
    data = request.json
    email = data.get('email')
    username =  data.get('username')
    password = data.get('password')
    department = data.get('department')
    city = data.get('city')

    not_unique_email = Client.query.filter_by(email=email).first()
    not_unique_username = Client.query.filter_by(username=username).first()

    if not_unique_email:
        return jsonify({"error": 'Email is already in use'}),400
    if not_unique_username:
        return jsonify({"error":'Username is already in use'}),400
    
    try:
        new_client = Client(email=email, username=username, department=department,city=city)
        new_client.set_password(password)
        db.session.add(new_client)
        db.session.commit()
        try:
            access_token = create_access_token(identity=new_client.id, additional_claims={"client_id": new_client.id,"role":"client"})

            return jsonify({'token':access_token})
        except Exception as e:
            return jsonify({"error":str(e)})
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request',e), 500
    
@api.route('/register/restaurant', methods=['POST'])
def restaurant_registration():
    data = request.json
    print("🔹 Datos recibidos en Flask:", data)  # 🔍 Verifica si llega bien
    print("🔹 Horario recibido:", data.get("schedule"))  # 🔍 Verifica si el horario llega con el formato correcto
    email = data.get('email')
    username =  data.get('username')
    password = data.get('password')
    department = data.get('department')
    city = data.get('city')
    name = data.get('name')
    schedule = data.get('schedule')
    cuisine_type = data.get('cuisine_type')
    exact_address = data.get('exact_address')
    social_networks = data.get('social_networks')
    phone = data.get('phone')
    description = data.get('description')
    image = data.get('image')

    not_unique_email = Restaurant.query.filter_by(email=email).first()
    not_unique_username = Restaurant.query.filter_by(username=username).first()

    if not_unique_email:
        return jsonify({"error": 'Email is already in use'}),400
    if not_unique_username:
        return jsonify({"error":'Username is already in use'}),400
    
    try:
        new_restaurant = Restaurant(email=email, username=username, department=department,city=city, name=name, schedule=schedule, cuisine_type=cuisine_type, exact_address=exact_address, social_networks=social_networks, phone=phone, description=description, image=image)
        new_restaurant.set_password(password)
        db.session.add(new_restaurant)
        db.session.commit()
        access_token = create_access_token(identity=new_restaurant.id, additional_claims={"restaurant_id": new_restaurant.id,"role":"restaurant"})

        return jsonify({'token':access_token}), 201
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/modify/registration/restaurant', methods=['PUT'])
def modify_restaurant_registration():
    data = request.json
    restaurant_id = data['restaurant_id']
    try:
        if restaurant_id:
            restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
            if restaurant:
                for key, value in data.items():
                    if hasattr(restaurant, key):
                        if value:
                            setattr(restaurant,key,value)
                db.session.commit()
  
        return jsonify(restaurant.serialize()), 201
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/registration/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant_registration(restaurant_id):
    try:
        restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
        if restaurant:
            return jsonify(restaurant.serialize()), 201
        else:
            return jsonify({"error":"Restaurant not found"}),404
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/login/client', methods=['POST'])
def client_login(): 
    data = request.json
    email = data.get('email', None)
    username =  data.get('username',None)
    password = data.get('password')
    if email:
        client = Client.query.filter_by(email=email).first()
    elif username:
        client = Client.query.filter_by(username=username).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if client and client.check_password(password):
       
            access_token = create_access_token(identity=str(client.id), additional_claims={"client_id": client.id,"role":"client"})
            return jsonify({"token": access_token}), 200
    
        return jsonify({"message": "Check your username/email and password"}), 400
    except DataError as e:
        db.session.rollback()
        return jsonify('error: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('error: Failed to process request'), 500
    
@api.route('/login/restaurant', methods=['POST'])
def restaurant_login():
    data = request.json
    email = data.get('email', None)
    username =  data.get('username',None)
    password = data.get('password')
    if email:
        restaurant = Restaurant.query.filter_by(email=email).first()
    elif username:
        restaurant = Restaurant.query.filter_by(username=username).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if restaurant and restaurant.check_password(password):
       
            access_token = create_access_token(identity=str(restaurant.id), additional_claims={"restaurant_id": restaurant.id,"role":"restaurant"})
            return jsonify({"token": access_token}), 200
    
        return jsonify({"message": "Check your username/email and password"}), 400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/new/menu', methods=['POST'])
@jwt_required()
def add_menu():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request, JSON body required"}), 400

    name = data.get("name")
    currency = data.get("currency")
    restaurant_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")

    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Only restaurants can create menus"}), 403
    try:
        new_menu = Menu(name=name, restaurant_id=restaurant_id, currency=currency)
        db.session.add(new_menu)
        db.session.commit()
        return jsonify(new_menu.serialize()), 201
    except DataError as e:
        db.session.rollback()
        return jsonify({"error": f"Bad Request: {e.args[0]}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Server error: Failed to process request"}), 500

@api.route('/publish/menu/<int:menu_id>', methods=['PUT'])
def publish_menu(menu_id):
    try:
        if menu_id:
            menu = Menu.query.filter_by(id=menu_id).first()
            if menu:
                menu.is_active = True
                db.session.commit()
                return jsonify({'message':'Menu published successfully'}), 201
            else:
                return jsonify({'message':'Menu not found in database'}), 404
        else:
            return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/unpublish/menu/<int:menu_id>', methods=['PUT'])
def unpublish_menu(menu_id):
    try:
        if menu_id:
            menu = Menu.query.filter_by(id=menu_id).first()
            if menu:
                menu.is_active = False
                db.session.commit()
                return jsonify({'message':'Menu unpublished successfully'}), 201
            else:
                return jsonify({'message':'Menu not found in database'}), 404
        else:
            return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/delete/menu/<int:menu_id>', methods=['DELETE'])
def delete_menu(menu_id):
    try:
        if menu_id:
            delete_menu = Menu.query.filter_by(id=menu_id).first()
            if not delete_menu:
                return jsonify({"error": "Menu not found"}), 400
            db.session.delete(delete_menu)
            db.session.commit()
            return jsonify('Successfully deleted menu'), 201
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/new/dish/', methods=['POST'])
def add_dish():
    data = request.json
    description = data.get('description',None)
    image_URL = data.get('image',None)
    try:
        if data["name"] and data["category"] and data["price"] and data["menu_id"]:
            new_dish = Dish(name=data['name'], category=data['category'], price=float(data["price"]),menu_id=data["menu_id"],description=description, image_URL=image_URL)
            if new_dish:
                db.session.add(new_dish)
                db.session.commit()
                return jsonify(new_dish.serialize()), 201
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/delete/dish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    try:
        if dish_id:
            delete_dish = Dish.query.filter_by(id=dish_id).first()
            if delete_dish:
                db.session.delete(delete_dish)
                db.session.commit()
                return jsonify('Dish has been deleted'), 201
            else:
                return jsonify('Dish not found'), 400
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    

@api.route('/delete/dish/category', methods=['DELETE'])
def delete_dish_category():
    data = request.get_json()
    category = data['category']
    menu_id = data['menu_id']
    try:
        if category and menu_id:
            delete_dish_category = Dish.query.filter_by(category=category,menu_id=menu_id).all()
            if len(delete_dish_category)>0:
                for dish in delete_dish_category:
                    db.session.delete(dish)
                db.session.commit()
            else:
                return jsonify('No dishes in this category'), 400
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/edit/dish', methods=['PUT'])
def edit_dish():
    data = request.get_json()
    try:
        edit_dish = Dish.query.filter_by(id=data["dish_id"]).first()
        if edit_dish:
            for key, value in data.items():
                if hasattr(edit_dish, key):
                    if value:
                        setattr(edit_dish,key,value)
            db.session.commit()
            
            return jsonify(edit_dish.serialize()),200
        else:
             return jsonify('Bad Request: Dish ID not found'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/menu/categories', methods=['PUT'])
def menu_categories():
    data = request.get_json()
    menu_id = data.get('menu_id')
    categories_list = data.get('categories',None)
    try:
        menu = Menu.query.filter_by(id=menu_id).first()
        if menu:
            menu.set_categories(categories_list)
            db.session.commit()
            return jsonify(menu.serialize()),200
        else:
             return jsonify('Bad Request: Menu ID not found'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/menu/<int:menu_id>', methods=['GET'])
def get_menu(menu_id):
    try:
        menu = Menu.query.filter_by(id=menu_id).first()
        if not menu:
            return jsonify({'message': 'Menu ID not found'}), 404

        categories = menu.get_categories()
        menu_response = {"menu": menu.serialize()}
        dish_list = {}

        for category in categories:
            dishes = Dish.query.filter_by(menu_id=menu_id, category=category).order_by(Dish.id).all()
            dish_list[category] = [dish.serialize() for dish in dishes] if dishes else 'No dishes in this category'

        return jsonify({**menu_response, **{'dishes': dish_list}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error: Failed to process request'}), 500

@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    try:
        restaurants = Restaurant.query.all()
        if not restaurants:
            return jsonify({'message': 'No restaurants found'}), 404
        return jsonify([res.serialize() for res in restaurants]), 200  
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error: Failed to process request'}), 500

    
@api.route('/restaurant/menus', methods=['GET'])
@jwt_required()
def get_restaurant_menus():
    restaurant_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')
    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Only restaurants can create menus"}), 403
    try:
        menus = Menu.query.filter_by(restaurant_id=restaurant_id).order_by(Menu.id).all()
        if not menus:
            return jsonify({'message': 'No menus at the moment'}), 200
        
        return jsonify([menu.serialize() for menu in menus]), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error: Failed to process request'}), 500
    

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
   
    data = request.get_json()
    client_identity = get_jwt_identity()  
    client_id = client_identity.get("id")  
    menu_id = data.get("menu_id")
    dish_id = data.get("dish_id")
    restaurant_id = data.get("restaurant_id")

    if sum(bool(x) for x in [menu_id, dish_id, restaurant_id]) != 1:
        return jsonify({"error": "Debes proporcionar SOLO un `menu_id`, `dish_id` o `restaurant_id`"}), 400

    existing_favorite = Favorites.query.filter_by(client_id=client_id, menu_id=menu_id, dish_id=dish_id,restaurant_id=restaurant_id).first()
    if existing_favorite:
        return jsonify({"error": "Este elemento ya está en tus favoritos"}), 400
    
    existing_favorite = Favorites.query.filter_by(
        client_id=client_id, menu_id=menu_id, dish_id=dish_id, restaurant_id=restaurant_id
    ).first()

    if existing_favorite:
        return jsonify({"error": "Este elemento ya está en tus favoritos"}), 400
   

    try:
        new_favorite = Favorites(
            client_id=client_id, 
            menu_id=menu_id if menu_id else None, 
            dish_id=dish_id if dish_id else None, 
            restaurant_id=restaurant_id if restaurant_id else None
        )
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Favorito agregado"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add favorite"}), 500

@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def remove_favorite(favorite_id):
    client_identity = get_jwt_identity()
    client_id = client_identity.get("id")

    favorite = Favorites.query.filter_by(id=favorite_id, client_id=client_id).first()

    if not favorite:
        return jsonify({"error": "Favorito no encontrado"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorito eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo eliminar el favorito"}), 500     

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites(client_id): 
    client_identity = get_jwt_identity()
    client_id = client_identity.get("id")

    favorites = Favorites.query.filter_by(client_id=client_id).all()
    if not favorites:
        return jsonify({"message": "No tienes favoritos aún"}), 200
      
    favorite_dishes = [fav.serialize() for fav in favorites]
    return jsonify(favorite_dishes), 200    

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()  
    return jsonify({"user": current_user}), 200

ADMIN_EMAILS = {"felipe@alpunto.com",
"gloria@alpunto.com",
"laura@alpunto.com",
"maria@alpunto.com"}

@api.route('/login/admin', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email).first()

    if admin and admin.check_password(password):
        if email in ADMIN_EMAILS:  
            access_token = create_access_token(identity={"id": admin.id, "role": "admin"})
            return jsonify({"token": access_token}), 200
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify({"message": "Check your email and password"}), 400

@api.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user = get_jwt_identity()
    if user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify({"message": "Welcome, Admin!"}), 200



@api.route('/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    
    if restaurant is None:
        return jsonify({'error': 'Restaurant not found'}), 404

    return jsonify({
        'id': restaurant.id,
        'email': restaurant.email,
        'username': restaurant.username,
        'name': restaurant.name,
        'department': restaurant.department,
        'city': restaurant.city,
        'schedule': restaurant.schedule, 
        'cuisine_type': restaurant.cuisine_type,
        'exact_address': restaurant.exact_address,
        'social_networks': restaurant.social_networks,
        'phone': restaurant.phone,
        'description': restaurant.description,
        'image': restaurant.image
        # 'menus': [menu.name for menu in restaurant.menus],  # Listado de menús
        # 'notifications': [notif.message for notif in restaurant.notifications]  # Mensajes de notificación
    })


@api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    try:
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"msg": "Restaurante no encontrado"}), 404

        data = request.get_json() 

        if not data:
            return jsonify({"msg": "Datos inválidos"}), 400

        restaurant.email = data.get('email', restaurant.email)
        restaurant.username = data.get('username', restaurant.username)
        restaurant.city = data.get('city', restaurant.city)
        restaurant.department = data.get('department', restaurant.department)
        restaurant.name = data.get('name', restaurant.name)
        restaurant.schedule = data.get('schedule', restaurant.schedule)
        restaurant.cuisine_type = data.get('cuisine_type', restaurant.cuisine_type)
        restaurant.exact_address = data.get('exact_address', restaurant.exact_address)
        restaurant.social_networks = data.get('social_networks', restaurant.social_networks)
        restaurant.phone = data.get('phone', restaurant.phone)
        restaurant.description = data.get('description', restaurant.description)

        db.session.commit()

        return jsonify({
            "msg": "Restaurante actualizado correctamente",
            "restaurant": restaurant.serialize() 
        }), 200

    except Exception as e:
        db.session.rollback() 
        return jsonify({"msg": "Error al actualizar el restaurante", "error": str(e)}), 500
    
    #Rutas para Explora y Descubre

    #Termina rutas para explora y descrubre, puedes continuar agregando despues de esta linea
