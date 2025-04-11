import { Op } from 'sequelize';
import Product, { ProductInput, ProductOutput } from '../models/Product';

export const createProduct = async (
  payload: ProductInput
): Promise<ProductOutput> => {
  return await Product.create(payload);
};

export const updateProductById = async (
  id: number,
  payload: Partial<ProductInput>
): Promise<ProductOutput | null> => {
  const [affectedRows, updatedProducts] = await Product.update(payload, {
    where: { id },
    returning: true,
  });

  if (affectedRows === 0) {
    return null;
  }

  return updatedProducts[0];
};

export const findProductById = async (
  id: number
): Promise<ProductOutput | null> => {
  return await Product.findByPk(id);
};

export const deleteProductById = async (id: number): Promise<boolean> => {
  const deletedRows = await Product.destroy({
    where: { id },
  });
  return deletedRows > 0;
};

export const fetchAllProducts = async (): Promise<ProductOutput[]> => {
  return Product.findAll();
};

// TODO - implementare ricerca con filtri
// export const fetchAllProducts = async (
//   filters?: GetAllProductFilters
// ): Promise<ProductOutput[]> => {
//   return Product.findAll({
//     where: {
//       ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
//     },
//     ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
//   });
// };

// TODO - update di più prodotti in una sola volta
// export const bulkUpdateProducts = async (
//   productsToUpdate: { id: number; payload: Partial<ProductInput> }[]
// ): Promise<ProductOutput[]> => {
//   const updatedProducts: ProductOutput[] = [];
//   for (const { id, payload } of productsToUpdate) {
//     const product = await Product.findByPk(id);
//     if (product) {
//       await product.update(payload);
//       updatedProducts.push(product.get({ plain: true }) as ProductOutput); // Ottieni una versione "plain" per la consistenza
//     }
//   }
//   return updatedProducts;
// };
