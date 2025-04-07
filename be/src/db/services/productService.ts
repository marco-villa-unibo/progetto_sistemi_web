// import { pool } from '../utils/db';
import { ModelCtor } from 'sequelize/types/model';
import Product, { ProductInput, ProductOutput } from '../models/Product';
import { ProductDTO, UserDTO } from '../../api/types';

export const createProduct = async (
  p: ProductInput
): Promise<ProductOutput> => {
  return Product.create(p);
};

export const fetchAllProducts = (): Promise<ProductOutput[]> => {
  return Product.findAll();
};

export const findProductById = (id: number): Promise<ProductOutput | null> => {
  return Product.findByPk(id);
};

export const updateProductById = (
  id: number,
  p: ProductDTO
): Promise<[affectedCount: number]> => {
  return Product.update(
    {
      title: p.title,
      pDescription: p.pDescription,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      imageUrl: p.imageUrl,
    },
    { where: { id: id } }
  );
};

// REVIEW
export const deleteProduct = (id: number): Promise<any> => {
  return Product.findByPk(id)
    .then((p: any) => {
      return p?.destroy();
    })
    .catch((e: any) => {
      return e;
    });
};

// TODO - cerca per categoria
// TODO - update di più prodotti in una sola volta
