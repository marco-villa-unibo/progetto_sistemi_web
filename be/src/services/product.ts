// import { pool } from '../utils/db';
import { Product, ProductModel } from '../models';

export const fetchAllProducts = (): Promise<ProductModel[]> => {
  return Product.findAll();
};

// // mysql2
// export const fetchAllProducts = async (): Promise<ProductModel[]> => {
//   const [rows] = await pool.query<ProductModel[]>('SELECT * FROM products');
//   return rows;
// };

export const findProductById = (id: number): Promise<ProductModel | null> => {
  return Product.findByPk(id);
};

// export const createProduct = (p: Product) => {
//   return pool.execute(
//     'INSERT INTO products (title, description, category, price, quantity, imageUrl, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)',
//     [
//       p.title,
//       p.pDescription,
//       p.category,
//       p.price,
//       p.quantity,
//       p.imageUrl,
//       false,
//     ]
//   );
// };

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
