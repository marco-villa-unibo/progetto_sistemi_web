import { DataTypes, Model, ModelCtor, Optional } from 'sequelize';
import { UserDTO } from '../../api/types';
import { sequelizeConnection } from '../dbConfig';
import { RowDataPacket } from 'mysql2';
import { UserRoleDTO, UserRoleEnum } from '../../api/types';

/**
 * User -> Sequelize Model Creator (per interagire con il DB)
 * UserInput ->
 * UserOutput ->
 */

interface UserAttributes extends UserDTO {}

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
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
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
  }
);

export default User;

// Tipo per il modello, che rappresenta tutte le proprietà, incluso id
// export interface UserModel
//   extends UserDTO,
//     RowDataPacket,
//     Model<UserDTO, UserCreationAttributes> {}
