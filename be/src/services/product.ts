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

// export const updateProduct = (id: number, p: Product) => {
//   return pool.execute('UPDATE products SET products.title = ?, WHERE id = ?', [
//     id,
//   ]);
// };

// export const safeDeleteProduct = (id: number) => {
//   return pool.execute(
//     'UPDATE products SET products.deleted = TRUE WHERE id = ?',
//     [id]
//   );
// };
