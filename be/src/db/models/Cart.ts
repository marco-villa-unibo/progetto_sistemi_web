// src/db/models/Cart.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import { User } from '.';
import { CartDTO } from '../../api/types/cartDto';

interface CartAttributes extends CartDTO {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartInput
  extends Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface CartOutput extends Required<CartAttributes> {}

class Cart extends Model<CartAttributes, CartInput> implements CartAttributes {
  public id!: number;
  public UserId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associazioni
  public static associate(models: any) {
    Cart.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'CartId',
      as: 'cartItems',
      onDelete: 'CASCADE',
    });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'Carts',
  }
);

export default Cart;
