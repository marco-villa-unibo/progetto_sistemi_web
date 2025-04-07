import { RowDataPacket } from 'mysql2';
import { ProductDTO } from '../../api/types';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../dbConfig';
import { CategoryDTO, CategoryEnum } from '../../api/types/categoryDto';
import { UserInput } from './User';

/**
 * Product -> Sequelize Model Creator (per interagire con il DB)
 * ProductInput ->
 * ProductOutput ->
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
      type: DataTypes.INTEGER,
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

// Tipo per i dati di creazione: solo le proprietà che sono obbligatorie per la creazione del prodotto
// interface ProductCreationAttributes extends Optional<ProductDTO, 'id'> {
//   title: string;
//   pDescription: string;
//   category: CategoryDTO;
//   price: number;
//   quantity: number;
// }

// // Tipo per il modello, che rappresenta tutte le proprietà, incluso id
// export interface ProductModel
//   extends ProductDTO,
//     RowDataPacket,
//     Model<ProductDTO, ProductCreationAttributes> {}

// export const Product = sequelize.define<ProductModel>('product', {});
////////////////////////////////////////////////////////////////////////////
