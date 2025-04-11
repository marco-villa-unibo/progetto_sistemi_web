// src/db/models/CartItem.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import { Cart, Product } from '.';
import { CartItemDTO } from '../../api/types/cartDto';

interface CartItemAttributes extends CartItemDTO {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItemInput
  extends Optional<CartItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface CartItemOutput extends Required<CartItemAttributes> {}

class CartItem
  extends Model<CartItemAttributes, CartItemInput>
  implements CartItemAttributes
{
  public id!: number;
  public CartId!: number;
  public ProductId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associazioni
  public static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: 'CartId', as: 'cart' });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'ProductId',
      as: 'product',
    });
  }
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Cart, key: 'id' },
      onDelete: 'CASCADE', // Se il carrello viene eliminato, elimina anche gli elementi
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Product, key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'CartItems',
  }
);

export default CartItem;
