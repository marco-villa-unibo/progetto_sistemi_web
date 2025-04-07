import { RowDataPacket } from 'mysql2';
import { ProductDTO } from '../../api/types';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import { CategoryDTO, CategoryEnum } from '../../api/types/categoryDto';
import { UserInput } from './User';

/**
 * ProductAttributes -> defines all the possible attributes of our model
 * Product -> Sequelize Model Creator (per interagire con il DB)
 * ProductInput -> defines the type of the object passed to Sequelize’s model.create
 * ProductOutput -> defines the returned object from model.create...
 */

interface ProductAttributes extends ProductDTO {}

export interface ProductInput extends Optional<ProductAttributes, 'id'> {
  user: UserInput;
}

export interface ProductOutput extends Required<ProductAttributes> {}

class Product
  extends Model<ProductAttributes, ProductInput>
  implements ProductAttributes
{
  public id!: number;
  public title!: string;
  public pDescription!: string;
  public category!: CategoryDTO;
  public price!: number;
  public quantity!: number;
  public imageUrl!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(CategoryEnum)),
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: true,
  }
);

export default Product;
