import { DataTypes, Model, Optional } from 'sequelize';
import { UserDTO } from '../../api/types';
import { sequelizeConnection } from '../dbConfig';
import { UserRoleDTO, UserRoleEnum } from '../../api/types';
import { Product } from '.';

/**
 * User -> Sequelize Model Creator (per interagire con il DB)
 * UserInput ->
 * UserOutput ->
 */

interface UserAttributes extends UserDTO {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}

export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public address!: string;
  public userRole!: UserRoleDTO;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

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
    password: {
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
