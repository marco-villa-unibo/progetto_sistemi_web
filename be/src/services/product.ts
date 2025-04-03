import { Product } from '../models';
import { pool } from '../utils/db';

export const fetchAllProducts = async (): Promise<Product[]> => {
  const [rows] = await pool.query<Product[]>('SELECT * FROM products');
  return rows;
};

export const findProductById = (id: number) => {
  return pool.execute(
    'SELECT * FROM products WHERE products.id = ? AND products.deleted = FALSE',
    [id]
  );
};

export const createProduct = (p: Product) => {
  return pool.execute(
    'INSERT INTO products (title, description, category, price, quantity, imageUrl, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      p.title,
      p.pDescription,
      p.category,
      p.price,
      p.quantity,
      p.imageUrl,
      false,
    ]
  );
};

// export const updateProduct = (id: number, p: Product) => {
//   return pool.execute('UPDATE products SET products.title = ?, WHERE id = ?', [
//     id,
//   ]);
// };

export const safeDeleteProduct = (id: number) => {
  return pool.execute(
    'UPDATE products SET products.deleted = TRUE WHERE id = ?',
    [id]
  );
};
