import { DataTypes, Model, Optional } from 'sequelize';
import { ProductDTO } from '../../api/types';
import { sequelizeConnection } from '../dbConfig';
import { CategoryDTO, CategoryEnum } from '../../api/types';
import { User } from '.';

/**
 * ProductAttributes -> defines all the possible attributes of our model
 * Product -> Sequelize Model Creator (per interagire con il DB)
 * ProductInput -> defines the type of the object passed to Sequelize’s model.create
 * ProductOutput -> defines the returned object from model.create...
 */

interface ProductAttributes extends ProductDTO {
  id?: number;
  imageUrl: string;
  UserId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInput extends Optional<ProductAttributes, 'id'> {
  // imageUrl: string;
  UserId: number;
}

export interface ProductOutput extends Required<ProductAttributes> {
  imageUrl: string;
}

class Product
  extends Model<ProductAttributes, ProductInput>
  implements ProductAttributes
{
  public id!: number;
  public title!: string;
  public pDescription!: string;
  public category!: CategoryDTO;
  public price!: string;
  public quantity!: string;
  public imageUrl!: string;
  public UserId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Associazione con User
  public readonly user?: User; // "user" sarà una singola istanza di User
  public static associate(models: any) {
    Product.belongsTo(models.User, {
      foreignKey: 'UserId', // Nome della colonna FK (deve corrispondere a hasMany in User)
      as: 'user', // Alias per accedere all'utente del prodotto (es. product.user)
      onDelete: 'CASCADE', // Opzione per l'eliminazione (opzionale)
      onUpdate: 'CASCADE', // Opzione per l'aggiornamento (opzionale)
    });
  }
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
    UserId: {
      // Definizione della colonna FK
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nome della tabella di riferimento (solitamente in PascalCase)
        key: 'id', // Nome della colonna di riferimento nella tabella Users
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Products',
  }
);

export default Product;
