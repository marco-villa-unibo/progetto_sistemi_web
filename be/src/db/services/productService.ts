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
  const prod = await Product.findByPk(id);

  if (!prod) return null;

  return await prod.update(payload);
};

export const findProductById = async (
  id: number
): Promise<ProductOutput | null> => {
  return await Product.findByPk(id);
};

export const deleteProductById = async (id: number): Promise<boolean> => {
  const numDeletedProducts = await Product.destroy({
    where: { id },
  });

  return !!numDeletedProducts;
};

export const fetchAllProducts = async (): Promise<ProductOutput[]> => {
  return Product.findAll();
};

// export const fetchAllProducts = async (
//   filters: GetAllProductFilters
// ): Promise<ProductOutput[]> => {
//   return Product.findAll({
//     where: {
//       ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
//     },
//     ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
//   });
// };

// TODO - update di più prodotti in una sola volta
