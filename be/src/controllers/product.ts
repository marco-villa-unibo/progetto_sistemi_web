import { Request, Response } from 'express';
import { ProductDto } from '../types';
import { fetchAllProducts } from '../services';
import { ProductModel } from '../models';

export const getAllProducts = async (
  req: Request<{}, ProductModel[]>,
  res: Response
) => {
  const p: ProductModel[] = await fetchAllProducts();
  res.status(200).send(p);
};
