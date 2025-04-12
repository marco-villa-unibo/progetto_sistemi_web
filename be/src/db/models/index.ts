import { sequelizeConnection } from '../dbConfig';
import Product from './Product';
import User from './User';
import Cart from './Cart';
import CartItem from './CartItem';
import Order from './Order';
import OrderItem from './OrderItem';

const models = {
  User: User,
  Product: Product,
  Cart: Cart,
  CartItem: CartItem,
  Order: Order,
  OrderItem: OrderItem,
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

export { sequelizeConnection, User, Product, Cart, CartItem, Order, OrderItem };
