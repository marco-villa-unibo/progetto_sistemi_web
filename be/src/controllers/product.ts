import { Request, Response } from 'express';
import { ProductDto } from '../types';
import { fetchAllProducts } from '../services';
import { Product } from '../models';

export const getAllProducts = async (
  req: Request<{}, Product[]>,
  res: Response
) => {
  const p: Product[] = await fetchAllProducts();
  res.status(200).send(p);
};
