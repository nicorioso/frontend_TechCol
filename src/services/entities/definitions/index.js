import { adminsEntity } from './admins';
import { cartsEntity } from './carts';
import { customersEntity } from './customers';
import { ordersEntity } from './orders';
import { productsEntity } from './products';

export const ENTITY_DEFINITIONS = {
  customers: customersEntity,
  admins: adminsEntity,
  products: productsEntity,
  carts: cartsEntity,
  orders: ordersEntity,
};

export const getEntityDefinition = (entity) => ENTITY_DEFINITIONS[entity];
