import { RowDataPacket } from 'mysql2';
import { ProductDto } from '../types';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';

// Tipo per i dati di creazione: solo le proprietà che sono obbligatorie per la creazione del prodotto
interface ProductCreationAttributes extends Optional<ProductDto, 'id'> {}

// Tipo per il modello, che rappresenta tutte le proprietà, incluso id
export interface ProductModel
  extends ProductDto,
    RowDataPacket,
    Model<ProductDto, ProductCreationAttributes> {}

export const Product = sequelize.define<ProductModel>('product', {
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
    type: DataTypes.STRING,
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
    allowNull: false,
  },
});
