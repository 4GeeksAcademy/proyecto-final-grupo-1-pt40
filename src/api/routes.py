"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from api.models import db, Client, Restaurant, Menu, Dish,Favorites,Admin, Notification, Report
from flask import Flask, request, jsonify, url_for, Blueprint, Response,send_file
from werkzeug.utils import secure_filename
from sqlalchemy.exc import DataError,IntegrityError
from sqlalchemy import or_
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity,get_jwt,decode_token
from flask_jwt_extended import JWTManager
from jwt import ExpiredSignatureError, InvalidTokenError
import json
import os
from dotenv import load_dotenv
import paypalrestsdk
from datetime import timedelta



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
load_dotenv()
FRONTEND_URL = os.getenv('FRONTEND_URL')


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
            expiration = timedelta(minutes=45)
            access_token = create_access_token(identity=str(new_client.id),expires_delta=expiration, additional_claims={"role":"client"})
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
        expiration = timedelta(minutes=45)
        access_token = create_access_token(identity=str(new_restaurant.id), expires_delta = expiration,additional_claims={"role":"restaurant"})
        return jsonify({'token':access_token}), 201
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/modify/registration/restaurant', methods=['PUT'])
@jwt_required()
def modify_restaurant_registration():
    data = request.json
    restaurant_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")

    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Login failed, not authorized to modify registration"}), 403
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
            expiration = timedelta(minutes=45)
            access_token = create_access_token(identity=str(client.id), expires_delta= expiration,additional_claims={"role":"client"})
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
            expiration = timedelta(minutes=45)
            access_token = create_access_token(identity=str(restaurant.id), expires_delta=expiration, additional_claims={"role":"restaurant"})
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
    currency = data.get("currency","COP")
    restaurant_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")

    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Only restaurants can create menus"}), 403
    
    restaurant= Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": " Restaurant not found"}),404
    
    is_premium=restaurant.plan

    menu_count = Menu.query.filter_by(restaurant_id=restaurant_id).count()

    if not is_premium and menu_count>=1:
        return jsonify({"error":"Limit reached:Free restaurants can only have 1 menu"}),403
    
    try:
        new_menu = Menu(name=name, restaurant_id=restaurant_id, currency=currency)
        db.session.add(new_menu)
        db.session.commit()
        return jsonify(new_menu.serialize()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error":"Database integrity error. Possible duplicate or constraint violation"}),400
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

@api.route('/menu/<int:menu_id>', methods=['PUT'])
@jwt_required()
def update_menu(menu_id):
    body = request.get_json()
    name = body.get("name", None)
    currency = body.get("currency", None)

    menu = Menu.query.get(menu_id)
    if not menu:
        return jsonify({"error": "Menu not found"}), 404

    if name:
        menu.name = name
    if currency:
        menu.currency = currency

    db.session.commit()
    return jsonify({"message": "Menu updated successfully", "menu": menu.serialize()}), 200    
    
@api.route('/new/dish/', methods=['POST'])
@jwt_required()
def add_dish():
    data = request.json
    if not data:
        return jsonify({"error":"Invalid request,JSON body required"}),400
    
    name=data.get('name')
    category=data.get('category')
    price=data.get('price')
    menu_id=data.get('menu_id')
    description = data.get('description',None)
    image_URL = data.get('image',None)

    claims=get_jwt()
    role=claims.get("role")
    if role !="restaurant":
        return jsonify({"error":"Unauthorized:Only restaurants can add dishes"}),403
    if not all ([name,category,price,menu_id]):
        return jsonify ({"error":"Missing required fields (name,category,price,menu_id)"}),400
    try:
       price=float(price)
       if price <=0:
           return jsonify({"error":"Price must be greater than zero"}),400
    except ValueError:
        return jsonify ({"error":"Invalid price format. It must be a number"}),400
    
    menu= Menu.query.get(menu_id)
    if not menu:
        return jsonify({"error":" Menu not found"},404)
    restaurant=Restaurant.query.get(menu.restaurant_id)
    if not restaurant:
        return jsonify({"error":"Restaurant not found"}),404
    is_premiun=restaurant.plan
    dish_count=Dish.query.filter_by(menu_id=menu_id).count()
    if not is_premiun and dish_count >=10:
        return jsonify({"error":"Limit reached: Free restaurants can only have 10 dishes"}),403
    try:
        new_dish=Dish(
            name=name,
            category=category,
            price=price,
            menu_id=menu_id,
            description=description,
            image_URL=image_URL

        )
        db.session.add(new_dish)
        db.session.commit()
        return jsonify(new_dish.serialize()),201
    
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
        restaurant = Restaurant.query.filter_by(id=menu.restaurant_id).first()
        return jsonify({**menu_response, **{'dishes': dish_list},**{'restaurant':restaurant.serialize()}}), 200
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

@api.route('/clients', methods=['GET'])
def get_clients():
    try:
        clients = Client.query.all()
        if not clients:
            return jsonify({'message': 'No clients found'}), 404
        return jsonify([client.serialize() for client in clients]), 200  
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
    
@api.route('/restaurant/<username>/menus/public', methods=['GET'])
def get_restaurant_menus_public(username):
    try:
        restaurant = Restaurant.query.filter_by(username=username).first()
        menus = Menu.query.filter_by(restaurant_id=restaurant.id).order_by(Menu.id).all()
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
    client_id = int (client_identity)  
    
    
    dish_id = data.get("dish_id")
    restaurant_id = data.get("restaurant_id")

    if sum(bool(x) for x in [ dish_id, restaurant_id]) != 1:
        return jsonify({"error": "Debes proporcionar SOLO un `dish_id` o `restaurant_id`"}), 400

    
    
    existing_favorite = Favorites.query.filter_by(
        client_id=client_id,  dish_id=dish_id, restaurant_id=restaurant_id
    ).first()

    if existing_favorite:
        return jsonify({"error": "Este elemento ya está en tus favoritos"}), 400
   

    try:
        new_favorite = Favorites(
            client_id=client_id, 
            
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
@jwt_required() 
def remove_favorite(favorite_id):
    client_identity = get_jwt_identity()
    client_id = int(client_identity)

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
def get_favorites():
    user_identity = get_jwt_identity() 
    client_id = get_jwt_identity()
  
    favorites = Favorites.query.filter_by(client_id=client_id).all()
    if not favorites:
        return jsonify({"message": "No tienes favoritos aún"}), 200
    result = []
    for fav in favorites:
        if fav.dish_id:
            dish = Dish.query.get(fav.dish_id)
            result.append({
                "id": fav.id,
                "dish": dish.serialize(),
                "restaurant": None
            })
        elif fav.restaurant_id:
            restaurant = Restaurant.query.get(fav.restaurant_id)
            result.append({
                "id": fav.id,
                "dish": None,
                "restaurant": restaurant.serialize()
            })
    return jsonify(result), 200    

# # Ruta para manejar notificaciones
# @api.route('/notifications', methods=['GET', 'POST', 'DELETE', 'PUT'])
# def handle_notifications():
#     if request.method == 'GET':
#         # Obtener todas las notificaciones
#         notifications = Notification.query.all()
#         return jsonify([notification.serialize() for notification in notifications]), 200

#     elif request.method == 'POST':
#         # Agregar una nueva notificación
#         data = request.json
#         message = data.get('message')
#         if not message:
#             return jsonify({"error": "Message is required"}), 400

#         new_notification = Notification(message=message)
#         db.session.add(new_notification)
#         db.session.commit()
#         return jsonify(new_notification.serialize()), 201
#     elif request.method == 'DELETE':
#         # Eliminar una notificación por ID
#         notification_id = request.json.get('id')
#         if not notification_id:
#             return jsonify({"error": "Notification ID is required"}), 400

#         notification = Notification.query.get(notification_id)
#         if not notification:
#             return jsonify({"error": "Notification not found"}), 404

#         db.session.delete(notification)
#         db.session.commit()
#         return jsonify({"message": "Notification deleted"}), 200

#     elif request.method == 'PUT':
#         # Marcar una notificación como leída
#         notification_id = request.json.get('id')
#         if not notification_id:
#             return jsonify({"error": "Notification ID is required"}), 400

#         notification = Notification.query.get(notification_id)
#         if not notification:
#             return jsonify({"error": "Notification not found"}), 404

#         notification.read = True
#         db.session.commit()
#         return jsonify(notification.serialize()), 200


# # Ruta para manejar reportes (solicitudes)
# @api.route('/reports', methods=['GET', 'POST'])
# def handle_reports():
#     if request.method == 'GET':
#         # Obtener todos los reportes
#         reports = Report.query.all()
#         return jsonify([report.serialize() for report in reports]), 200

#     elif request.method == 'POST':
#         # Enviar un nuevo reporte
#         data = request.json
#         recipient = data.get('recipient')
#         message = data.get('message')
#         if not recipient or not message:
#             return jsonify({"error": "Recipient and message are required"}), 400

#         new_report = Report(recipient=recipient, message=message, date=datetime.utcnow())
#         db.session.add(new_report)
#         db.session.commit()
#         return jsonify(new_report.serialize()), 201
 

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    claims=get_jwt()
    role=claims.get("role")
    identity=get_jwt_identity()
    user_id=int(identity)
    if role == "client":
        client = Client.query.get(user_id)
        return client.serialize(), 200
    elif role == "restaurant":
        restaurant = Restaurant.query.get(user_id)
        return restaurant.serialize(), 200
    else:
        return {"error": "Rol inválido"}, 400






@api.route('/restaurant/profile', methods=['GET'])
@jwt_required()
def get_restaurant_by_id():
    restaurant_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')

    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Not authorized to view profile"}), 403

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
        'image': restaurant.image,
        'plan': restaurant.plan

        # 'menus': [menu.name for menu in restaurant.menus],  # Listado de menús
        # 'notifications': [notif.message for notif in restaurant.notifications]  # Mensajes de notificación
    })


@api.route('/restaurant/profile', methods=['PUT'])
@jwt_required()
def update_restaurant():
    restaurant_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')

    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Not authorized to view profile"}), 403
    
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
        restaurant.image = data.get('image', restaurant.image)

        db.session.commit()

        return jsonify({
            "msg": "Restaurante actualizado correctamente",
            "restaurant": restaurant.serialize() 
        }), 200

    except Exception as e:
        db.session.rollback() 
        return jsonify({"msg": "Error al actualizar el restaurante", "error": str(e)}), 500
    
    #Rutas para Explora y Descubre
@api.route('/search', methods=['POST'])
def search():
    data = request.json
    department = data.get('department',None)
    city = data.get('city',None)
    cuisine = data.get('cuisine',None)
    keyword = data.get('keyword',None)
    query = Restaurant.query
    try:
        if department:
            query = query.filter_by(department=department)
        if city:
            query = query.filter_by(city=city)
        if cuisine:
            query = query.filter_by(cuisine_type=cuisine)
        if keyword:
            keyword_filter = '%{}%'.format(keyword)
            query =query.filter(or_(Restaurant.name.ilike(keyword_filter), Restaurant.description.ilike(keyword_filter)))
        
        restaurants = query.all()
        result = [restaurant.serialize() for restaurant in restaurants]
        return jsonify(result),200
    except Exception as e:
        db.session.rollback() 
        return jsonify({"msg": "Error al buscar restaurantes", "error": str(e)}), 500

@api.route('/top-restaurants/', methods=['GET'])
@jwt_required()
def top_restaurants():
    client_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')

    if role != "client":
            return jsonify({"error": "Unauthorized: Must use client account"}), 403
    try:
        client = Client.query.get(client_id)
        client_city = client.city
        top_restaurants = db.session.query(Restaurant, db.func.count(Favorites.id).label('likes')
        ).join(Favorites, Restaurant.id == Favorites.restaurant_id).filter(Restaurant.city == client_city).group_by(Restaurant.id).order_by(db.desc('likes')).limit(10).all()

        if not top_restaurants:
            return jsonify({"restaurants":[], "city":client_city}),202
        result = [restaurant[0].serialize() for restaurant in top_restaurants]
        return jsonify({"restaurants":result, "city":client_city}),200
    except Exception as e:
        db.session.rollback() 
        return jsonify({"msg": "Error al buscar restaurantes", "error": str(e)}), 500
    #Termina rutas para explora y descrubre, puedes continuar agregando despues de esta linea

@api.route('/orders', methods=['POST'])
def create_order():
    request_body = request.get_json()
    cart = request_body['cart']  # Use the cart information as needed
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": f"{os.getenv('FRONTEND_URL')}restaurant-dashboard",
            "cancel_url": f"{os.getenv('FRONTEND_URL')}restaurant-dashboard"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "test item",
                    "sku": "item",
                    "price": "10.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": "10.00",
                "currency": "USD"
            },
            "description": "This is the payment transaction description."
        }]
    })

    if payment.create():
        for link in payment.links:
            if link.rel == "approval_url":
                approval_url = link.href
                token = approval_url.split('token=')[1] 
                return jsonify({'approval_url': approval_url, 'order_id': payment.id, 'token':token})
    else:
        return jsonify({'error': payment.error}), 400

@api.route('orders/<order_id>/capture', methods=['POST'])
def capture_order(order_id):
    try:
        data = request.json
        orderID = data.get('orderID')
        payment = paypalrestsdk.Payment.find(orderID)
        if payment:
            if payment.execute({"payer_id": payment.payer.payer_info.payer_id}):
                    captured_payment = payment.to_dict()
                    return jsonify(captured_payment), 200
            else:
                return jsonify({'error': payment.error}), 400
        else:
            return jsonify({'error': 'Payment not found'}), 404
    except paypalrestsdk.exceptions.ResourceNotFound as e:
        return jsonify({'error': 'Resource not found', 'details': str(e)}), 404
    except Exception as e:
         return jsonify({'error': str(e)}), 500

@api.route('restaurant/successful/payment', methods=['PUT'])
@jwt_required()
def update_plan():
    restaurant_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')
    if role != "restaurant":
            return jsonify({"error": "Unauthorized: Not authorized to view profile"}), 403
    if restaurant_id:
        try:
            restaurant = Restaurant.query.get(restaurant_id)
            restaurant.plan = True
            db.session.commit()
            return jsonify(restaurant.serialize()),200
        except Exception as e:
            db.session.rollback() 
            return jsonify({"msg": "Server error", "error": str(e)}), 500
    else:
        return jsonify({"msg": "Restaurant not found"}), 404
        
@api.route('/client/profile', methods=['GET'])
@jwt_required()
def get_client_by_id():
    client_id = get_jwt_identity()  
    claims = get_jwt()
    role = claims.get('role')

    if role != "client":
        return jsonify({"error": "Unauthorized: Not authorized to view profile"}), 403

    client = Client.query.get(client_id)
    
    if client is None:
        return jsonify({'error': 'Client not found'}), 404

    return jsonify({
        'client_id': client.id,
        'email': client.email,
        'username': client.username,
        'department': client.department,
        'city': client.city,
        'is_active': client.is_active
    })

@api.route('/client/profile', methods=['PUT'])
@jwt_required()
def update_client():
    client_id = get_jwt_identity()  # Get client ID from JWT token
    claims = get_jwt()
    role = claims.get('role')

    # Check if the user is a client
    if role != "client":
        return jsonify({"error": "Unauthorized: Not authorized to update client profile"}), 403

    try:
        client = Client.query.get(client_id)
        if not client:
            return jsonify({"msg": "Cliente no encontrado"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"msg": "Datos inválidos"}), 400

        # Update only the fields provided in the request
        if 'department' in data:
            client.department = data['department']
        if 'city' in data:
            client.city = data['city']
        if 'password' in data and data['password']:
            client.set_password(data['password'])  # Hash the password using the model's method

        db.session.commit()

        return jsonify({
            "msg": "Cliente actualizado correctamente",
            "client": client.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el cliente", "error": str(e)}), 500    
    

@api.route('/reset-password/send-email', methods=['POST'])
def reset_password_email():
        data = request.json
        email = data.get('email',None)
        role = data.get('role',None)
        try:
            user = None

            if role == 'client':
                user = Client.query.filter_by(email=email).first()
            elif role == 'restaurant':
                user = Restaurant.query.filter_by(email=email).first()
            
            if not user:
                return jsonify({'error':'Incorrect email address'}),404
            
            expiration = timedelta(minutes=10)
            reset_token = create_access_token(identity=email, expires_delta=expiration,additional_claims={"role":role})
            status = send_email(email,reset_token)
            if status == 200:
                return jsonify({'msg':'Email sent successfully'}),200
            return jsonify({'msg':'Email not send'}),400
        except Exception as e:
            return jsonify({"msg": f"Server error: {e}"}), 500  

@api.route('/reset-password', methods=['GET', 'PUT'])
@jwt_required()
def reset_password():
    if request.method == 'GET':
        try:
            client_email = get_jwt_identity()
            return jsonify({'msg':'Token is valid','email':client_email}),200
        except ExpiredSignatureError:
            return jsonify({'msg':'Token is expired'}),401
        except InvalidTokenError:
            return jsonify({'msg':'Token is invalid'}),401
        except Exception as e:
            return jsonify({"msg": f"Server error: {e}"}), 500
    elif request.method == 'PUT':
        data = request.json
        identity = get_jwt_identity()  
        claims = get_jwt()
        role = claims.get('role')
        password = data.get('password',None)
        email = data.get('email',None)
        if not password or not email:
            return jsonify({'msg':'Must provide a new password'}), 400
        try: 
            if email == identity:
                if role == 'client':
                    client = Client.query.filter_by(email=email).first()
                    client.set_password(password)
                    db.session.commit()
                    return jsonify({'msg':f'Password changed successfully'}), 200
                elif role == 'restaurant':
                    restaurant = Restaurant.query.filter_by(email=email).first()
                    restaurant.set_password(password)
                    db.session.commit()
                    return jsonify({'msg':f'Password changed successfully'}), 200
            else:
                return jsonify({'msg':f'Invalid token'}), 403
        except Exception as e:
            return jsonify({"msg": "Server error"}), 500 
        

@api.route('/admins', methods=['GET'])
def get_admins():
    admins = Admin.query.all()
    if not admins:
        return jsonify('No hay admins'),200
    result = [admin.serialize() for admin in admins]
    return jsonify(result),200

@api.route('/login/admin', methods=['POST'])
def admin_login(): 
    data = request.json
    email = data.get('email', None)
    password = data.get('password')
    if email:
        admin = Admin.query.filter_by(email=email).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if admin and admin.check_password(password):
            expiration = timedelta(minutes=45)
            access_token = create_access_token(identity=str(admin.id), expires_delta= expiration,additional_claims={"role":"admin"})
            return jsonify({"token": access_token}), 200
        return jsonify({"message": "Check your username/email and password"}), 400
    except DataError as e:
        db.session.rollback()
        return jsonify('error: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('error: Failed to process request'), 500


@api.route('/admin/delete/restaurant/<restaurant_id>', methods=['DELETE'])
@jwt_required()
def delete_restaurant(restaurant_id):
    admin_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")
    if role != "admin":
            return jsonify({"error": "Unauthorized: Only administrators can delete restaurants"}), 403
    if restaurant_id:
        try:
            restaurant = Restaurant.query.get(restaurant_id)
            if restaurant:
                db.session.delete(restaurant)
                db.session.commit()
                return jsonify({'msg':"Restaurant deleted"}), 200
            else:
                return jsonify({'error':"Restaurant not found"}), 404
        except DataError as e:
            db.session.rollback()
            return jsonify('error: Incorrect data format/type'),400
        except Exception as e:
            db.session.rollback()
            return jsonify('error: Failed to process request'), 500

@api.route('/admin/delete/client/<client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    admin_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")
    if role != "admin":
            return jsonify({"error": "Unauthorized: Only administrators can delete clients"}), 403
    if client_id:
        try:
            client = Client.query.get(client_id)
            if client:
                db.session.delete(client)
                db.session.commit()
                return jsonify({'msg':"Client deleted"}), 200
            else:
                return jsonify({'error':"Client not found"}), 404
        except DataError as e:
            db.session.rollback()
            return jsonify('error: Incorrect data format/type'),400
        except Exception as e:
            db.session.rollback()
            return jsonify('error: Failed to process request'), 500
        
@api.route('/admin/reports', methods=['GET', 'PUT','DELETE'])
@jwt_required()
def admin_reports():
    admin_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")
    if role != "admin":
            return jsonify({"error": "Unauthorized: Access Restricted"}), 403
    if request.method == 'GET':
        try:
            reports = db.session.query(Report.id,Report.subject,Report.message, Report.read,Report.date,Report.restaurant_id,
                                       Restaurant.name.label("restaurant_name"), Restaurant.username.label("restaurant_username"), Restaurant.email.label("restaurant_email")).join(Restaurant, Report.restaurant_id == Restaurant.id).all()
            if reports:
                result = [{"report_id": report.id,
                            "subject": report.subject,
                            "message":report.message,
                            "read":report.read,
                            "date":report.date,
                            "restaurant":{"id":report.restaurant_id,
                                          "name":report.restaurant_name,
                                          "username":report.restaurant_username,
                                          "email":report.restaurant_email}} for report in reports]
                return jsonify(result), 200
            else:
                return jsonify([]), 200
        except DataError as e:
            db.session.rollback()
            return jsonify('error: Incorrect data format/type'),400
        except Exception as e:
            db.session.rollback()
            return jsonify('error: Failed to process request'), 500
    if request.method == 'PUT':
        data = request.json
        report_id = data.get('report_id',None)
        if report_id:
            try:
                report = Report.query.get(report_id)
                if report:
                    report.read = True
                    db.session.commit()
                    return jsonify({'msg': 'Report updated'}), 200
                else:
                    return jsonify({'msg':"Report not found"}),400
            except Exception as e:
                db.session.rollback()
                return jsonify('error: Failed to process request'), 500
   
    if request.method == 'DELETE':
        data = request.json
        report_id = data.get('report_id',None)
        if report_id:
            try:
                report = Report.query.get(report_id)
                if report:
                    db.session.delete(report)
                    db.session.commit()
                    return jsonify({'msg': 'Report deleted'}), 200
                else:
                    return jsonify({'msg':"Report not found"}),400
            except Exception as e:
                db.session.rollback()
                return jsonify('error: Failed to process request'), 500



@api.route('/make-report', methods=['POST'])
@jwt_required()
def make_report():
        client_id = get_jwt_identity() 
        claims = get_jwt() 
        role = claims.get("role")
        data = request.json
        restaurant_id = data.get('restaurant_id', None)
        subject = data.get('subject', None)
        message = data.get('message', None)
        if role != "client":
            return jsonify({"error": "Unauthorized: Access Restricted"}), 403
        
        if restaurant_id and subject and client_id:
            try:
                new_report = Report(client_id=client_id,restaurant_id=restaurant_id,subject=subject,message=message)
                db.session.add(new_report)
                db.session.commit()
                return jsonify({"msg":"Report posted to Admin database"}),200
            except Exception as e:
                db.session.rollback()
                return jsonify('error: Failed to process request'), 500
        else:
            return jsonify({'BadRequest':'Missing fields/data'}), 400
        
@api.route('/admin/notifications', methods=['GET', 'POST','DELETE'])
@jwt_required()
def admin_notifications():
    admin_id = get_jwt_identity() 
    claims = get_jwt() 
    role = claims.get("role")
    if role != "admin":
            return jsonify({"error": "Unauthorized: Access Restricted"}), 403
    if request.method == 'GET':
        try:
            notifications = db.session.query(Notification.id,Notification.subject,Notification.message, Notification.status,Notification.date,Notification.restaurant_id,
                                       Restaurant.name.label("restaurant_name"), Restaurant.username.label("restaurant_username"), Restaurant.email.label("restaurant_email")).join(Restaurant, Notification.restaurant_id == Restaurant.id).all()
            if notifications:
                result = [{"notification_id": notification.id,
                            "subject": notification.subject,
                            "message": notification.message,
                            "status":notification.status,
                            "date":notification.date,
                            "restaurant":{"id":notification.restaurant_id,
                                          "name":notification.restaurant_name,
                                          "username":notification.restaurant_username,
                                          "email":notification.restaurant_email}} for notification in notifications]
                return jsonify(result), 200
            else:
                return jsonify([]), 200
        except DataError as e:
            db.session.rollback()
            return jsonify('error: Incorrect data format/type'),400
        except Exception as e:
            db.session.rollback()
            return jsonify('error: Failed to process request'), 500
    if request.method == 'POST':
        data = request.json
        restaurant_id = data.get('restaurant_id',None)
        subject = data.get('subject',None)
        message = data.get('message',None)
        if restaurant_id and subject:
            try:
                notification = Notification(restaurant_id=restaurant_id, subject=subject,message=message)
                db.session.add(notification)
                db.session.commit()
                return jsonify({'msg': 'Notification sent!'}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': "Failed to process request", 'detail':str(e)}), 500
        else:
            return jsonify({"BadRequest":"Missing fields/data"}),400
   
    if request.method == 'DELETE':
        data = request.json
        notification_id = data.get('notification_id',None)
        if notification_id:
            try:
                notification = Notification.query.get(notification_id)
                if notification:
                    db.session.delete(notification)
                    db.session.commit()
                    return jsonify({'msg': 'Notification deleted'}), 200
                else:
                    return jsonify({'msg':"Notification not found"}),400
            except Exception as e:
                db.session.rollback()
                return jsonify('error: Failed to process request'), 500
            
@api.route('/restaurant/notifications', methods=['GET','PUT'])
@jwt_required()
def restaurant_notifications():
        restaurant_id = get_jwt_identity() 
        claims = get_jwt() 
        role = claims.get("role")
        if role != "restaurant":
            return jsonify({"error": "Unauthorized: Access Restricted"}), 403
        
        if request.method == 'GET':
            try:
                notifications = Notification.query.filter_by(restaurant_id=restaurant_id,status=True).all()
                result = [notification.serialize() for notification in notifications]
                return jsonify(result),200
            except Exception as e:
                db.session.rollback()
                return jsonify('error: Failed to process request'), 500
        if request.method == 'PUT':
            data = request.json
            notification_id = data.get('notification_id',None)
            if notification_id:
                try:
                    notification = Notification.query.get(notification_id)
                    if notification:
                        notification.status = False #Indica que el restaurante borro la notification
                        db.session.commit()
                        return jsonify({'msg': 'Notification updated'}), 200
                    else:
                        return jsonify({'msg':"Notification not found"}),400
                except Exception as e:
                    db.session.rollback()
                    return jsonify('error: Failed to process request'), 500
        

