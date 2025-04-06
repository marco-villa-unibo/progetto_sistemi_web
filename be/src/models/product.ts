import { RowDataPacket } from 'mysql2';
import { ProductDto } from '../types';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';
import { CategoryDto } from '../types/category';

/**
 * Product => Sequelize Model Creator (per interagire con il DB)
 * ProductModel => Openapi Model (per validazione, swagger e documentazione)
 * ProductDto => TS type del Prodotto (come viene salvato e restituito dalle api)
 */

// Tipo per i dati di creazione: solo le proprietà che sono obbligatorie per la creazione del prodotto
interface ProductCreationAttributes extends Optional<ProductDto, 'id'> {
  title: string;
  pDescription: string;
  category: CategoryDto;
  price: number;
  quantity: number;
  imageUrl: string;
}

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
