import { DataTypes, Model, Optional } from 'sequelize';
import { UserDTO } from '../../api/types';
import { sequelizeConnection } from '../dbConfig';
import { UserRoleDTO, UserRoleEnum } from '../../api/types';
import { Product } from '.';

/**
 * UserAttributes -> defines all the possible attributes of our model
 * User -> Sequelize Model Creator (per interagire con il DB)
 * UserInput -> defines the type of the object passed to Sequelize’s model.create
 * UserOutput -> defines the returned object from model.create...
 */

interface UserAttributes extends UserDTO {
  id?: number;
  passwordHash?: string;
  // imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {
  password: string;
}

export interface UserOutput
  extends Omit<
    Required<UserAttributes>,
    'passwordHash' | 'createdAt' | 'updatedAt'
  > {
  passwordHash?: string;
  token?: string; // TODO: gestire il login al momento della registrazione
}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public passwordHash!: string;
  public phone!: string;
  public address!: string;
  public userRole!: UserRoleDTO;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Associazione con Product
  public readonly products?: Product[]; // "products" sarà un array di Product istanze
  public static associate(models: any) {
    User.hasMany(models.Product, {
      foreignKey: 'UserId', // Nome della colonna FK in Product
      as: 'products', // Alias per accedere ai prodotti dell'utente (es. user.products)
      onDelete: 'CASCADE', // Opzione per l'eliminazione (opzionale)
      onUpdate: 'CASCADE', // Opzione per l'aggiornamento (opzionale)
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userRole: {
      type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Users',
  }
);

export default User;
