import { NextFunction, Request, Response } from 'express';
import { fetchAllProducts, findProductById } from '../services';
import { ProductModel } from '../models';
import { BadRequestError, NotFoundError } from '../error';

export const getAllProducts = async (
  req: Request<{}>,
  res: Response<ProductModel[]>
) => {
  const p: ProductModel[] = await fetchAllProducts();
  res.status(200).send(p);
};

export const getProductById = async (
  req: Request<{ id: number }>,
  res: Response<ProductModel>,
  next: NextFunction
) => {
  console.log('controller');
  const { id } = req.params;

  // TODO: trasferire controllo a validazione yaml
  if (id <= 0) {
    return next(new BadRequestError(`Product ID must be positive integer`));
  }

  const p = await findProductById(id);
  if (!p) {
    return next(new NotFoundError(`Product not found for ID ${id}`));
  }
  res.status(200).send(p);
};
