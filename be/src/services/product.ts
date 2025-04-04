// import { pool } from '../utils/db';
import { Product, ProductModel } from '../models';
import { ProductDto } from '../types';

export const fetchAllProducts = (): Promise<ProductModel[]> => {
  return Product.findAll();
};

export const findProductById = (id: number): Promise<ProductModel | null> => {
  return Product.findByPk(id);
};

export const createProduct = (p: ProductDto): Promise<ProductModel> => {
  return Product.create(p);
};

export const updateProductById = (
  id: number,
  p: ProductDto
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

export const deleteProduct = (id: number): Promise<any> => {
  return Product.findByPk(id)
    .then(p => {
      return p?.destroy();
    })
    .catch(e => {
      return e;
    });
};

// TODO - cerca per categoria
// TODO - update di più prodotti in una sola volta
