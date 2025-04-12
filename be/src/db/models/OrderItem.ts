import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import { Order, Product } from '.';
import { OrderItemDTO } from '../../api/types';

interface OrderItemAttributes extends OrderItemDTO {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemInput
  extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface OrderItemOutput extends Required<OrderItemAttributes> {}

class OrderItem
  extends Model<OrderItemAttributes, OrderItemInput>
  implements OrderItemAttributes
{
  public id!: number;
  public OrderId!: number;
  public ProductId!: number;
  public quantity!: number;
  public unitPrice!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associazioni
  public static associate(models: any) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'OrderId', as: 'order' });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'ProductId',
      as: 'product',
    });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Order, key: 'id' },
      onDelete: 'CASCADE', // Se l'ordine viene eliminato, elimina anche gli elementi
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Product, key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'OrderItems',
  }
);

export default OrderItem;
