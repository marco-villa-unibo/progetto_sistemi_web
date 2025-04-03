import { RowDataPacket } from 'mysql2';
import { ProductDto } from '../types';

export interface Product extends ProductDto, RowDataPacket {}
