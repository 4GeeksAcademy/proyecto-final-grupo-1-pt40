from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
import json
from datetime import datetime
from api.config import MAX_FREE_MENUS,MAX_FREE_DISHES_PER_MENU



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password_hash = db.Column(db.String(500), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    favorites = relationship('Favorites', back_populates='client')
    report =relationship('Report',back_populates='client')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return{
            'client_id':self.id,
            'username':self.username,
            'email':self.email
            
        }

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    name = db.Column(db.String(80), unique=False, nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    schedule = db.Column(db.JSON, nullable=True)
    cuisine_type = db.Column(db.String(100), nullable=True)
    exact_address = db.Column(db.String(255), nullable=True)
    social_networks = db.Column(db.String(650), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)
    plan = db.Column(db.Boolean, default=False)
    
    menus = relationship('Menu', back_populates='restaurant', lazy ='dynamic')
    notifications = relationship('RestaurantNotifications', back_populates='restaurant')
    favorites = relationship('Favorites', back_populates='restaurant')
    report = relationship('Report',back_populates='restaurant')

    def can_add_menu(self):
        if self.plan:
            return True
        return self.menus.count()< MAX_FREE_MENUS

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return{
            'restaurant_id':self.id,
            'name':self.name,
            'username':self.username,
            'email':self.email,
            'schedule': self.schedule,
            'image': self.image,
            'department':self.department,
            'city':self.city,
            'cuisine_type':self.cuisine_type,
            'exact_address':self.exact_address,
            'social_networks':self.social_networks,
            'phone': self.phone,
            'description':self.description,
            'plan':self.plan
        }

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    created = db.Column(db.DateTime,default=db.func.now())
    last_updated = db.Column(db.DateTime, default=db.func.now(),onupdate=db.func.now())
    categories = db.Column(db.Text, nullable=True)
    restaurant_id = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)
    currency = db.Column(db.String(10),nullable=True, default='COP')
    is_active = db.Column(db.Boolean, nullable=True, default=False)

    restaurant = relationship('Restaurant', back_populates='menus')
    dishes = relationship('Dish', back_populates='menu',lazy='dynamic', cascade='all, delete-orphan')
    favorites = relationship('Favorites', back_populates='menu')

    def can_add_dish(self):
        if self.restaurant.plan:
            return True
        return self.dishes.count()< MAX_FREE_DISHES_PER_MENU

    def set_categories(self, categories_list):
       self.categories = json.dumps(categories_list)

    def get_categories(self):
       if self.categories:
        return json.loads(self.categories)
       return []
    
    def serialize(self):
        return {
            "menu_id": self.id,
            "name": self.name,
            "restaurant_id":self.restaurant_id,
            "created":self.created,
            "last_updated":self.last_updated,
            "categories": self.get_categories(),
            "currency":self.currency,
            "is_active":self.is_active
        }
    
class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, ForeignKey('menu.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image_URL = db.Column(db.String(255), nullable=True)

    menu = relationship('Menu', back_populates='dishes')
    favorites = relationship('Favorites', back_populates='dish')

    def serialize(self):
        return {
            "dish_id":self.id,
            "name": self.name,
            "description":self.description,
            "menu_id": self.menu_id,
            "category": self.category,
            "price": float(self.price),
            "image":self.image_URL,
        }


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, ForeignKey('menu.id'),nullable=True)
    client_id = db.Column(db.Integer, ForeignKey('client.id'),nullable=False)
    dish_id = db.Column(db.Integer, ForeignKey('dish.id'),nullable=True)
    restaurant_id=db.Column(db.Integer,ForeignKey('restaurant.id'),nullable=True)

    client = relationship('Client', back_populates='favorites')
    menu = relationship('Menu', back_populates='favorites')
    dish = relationship('Dish', back_populates='favorites')
    restaurant =relationship('Restaurant',back_populates='favorites')

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "menu_id": self.menu.serialize() if self.menu else None,
            "dish_id": self.dish.serialize() if self.dish else None,
            "restaurant_id": self.restaurant_id
        }

class RestaurantNotifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=True)
    created = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey('admin.id'), nullable=False)

    restaurant = relationship('Restaurant', back_populates='notifications')   

class ClientNotifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, ForeignKey('admin.id'))
    created = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean, nullable=False)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return {
            'email':self.email
        }
    

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)
    read = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime,default=db.func.now())


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer,ForeignKey('client.id'),nullable=False)
    restaurant_id = db.Column(db.Integer,ForeignKey('restaurant.id'),nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    read = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime,default=db.func.now())

    restaurant = relationship('Restaurant',back_populates='report')
    client = relationship('Client',back_populates='report')

    def serialize(self):
        return {
            'report_id':self.id,
            'client_id':self.client_id,
            'restaurant_id':self.restaurant_id,
            'subject':self.subject,
            'message':self.message,
            'read': self.read,
            'date': self.date
        }

