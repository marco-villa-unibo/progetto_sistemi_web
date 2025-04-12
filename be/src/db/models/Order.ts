import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import {
  OrderStatusDTO,
  OrderStatusEnum,
  OrderWithItemsDTO,
} from '../../api/types';
import { User } from '.';

interface OrderAttributes extends OrderWithItemsDTO {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderInput
  extends Optional<
    OrderAttributes,
    | 'id'
    | 'orderDate'
    | 'totalAmount'
    | 'orderStatus'
    | 'createdAt'
    | 'updatedAt'
    | 'transactionId'
  > {}

export interface OrderOutput extends Required<OrderAttributes> {}

class Order
  extends Model<OrderAttributes, OrderInput>
  implements OrderAttributes
{
  public id!: number;
  public UserId!: number;
  public orderDate!: string;
  public totalAmount!: number;
  public orderStatus!: OrderStatusDTO;
  public shippingAddress!: string;
  public billingAddress!: string;
  public paymentMethod!: string;
  public transactionId?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associazioni
  public static associate(models: any) {
    Order.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'OrderId',
      as: 'orderItems',
      onDelete: 'CASCADE',
    });
  }
}

Order.init(
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
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      //   get() {
      //     const rawValue = this.getDataValue('orderDate');
      //     return rawValue ? new Date(rawValue).toISOString() : null; // Converti in ISO 8601 in lettura
      //   },
      //   set(value: string | Date) {
      //     this.setDataValue('orderDate', value); // Sequelize gestirà la conversione a Date
      //   },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    orderStatus: {
      type: DataTypes.ENUM(...Object.values(OrderStatusEnum)),
      allowNull: false,
      defaultValue: OrderStatusEnum.PENDING,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'Orders',
  }
);

export default Order;
