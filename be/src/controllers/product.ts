import { NextFunction, Request, Response } from 'express';
import { createProduct, fetchAllProducts, findProductById } from '../services';
import { ProductModel } from '../models';
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
  ServiceUnavailableError,
} from '../error';
import { ProductDto } from '../types';

interface ProdRequest extends Request {
  body: ProductModel;
  params: { id: string };
}

export const getAllProducts = async (
  req: ProdRequest,
  res: Response<ProductModel[]>
) => {
  const p: ProductModel[] = await fetchAllProducts();
  res.status(200).send(p);
};

export const getProductById = async (
  req: ProdRequest,
  res: Response<ProductModel>,
  next: NextFunction
) => {
  console.log('controller');
  const { id } = req.params;

  // TODO: trasferire controllo a validazione yaml
  if (isNaN(+id) || +id <= 0) {
    return next(new BadRequestError(`Product ID must be positive integer`));
  }

  const p = await findProductById(+id);
  if (!p) {
    return next(new NotFoundError(`Product not found for ID ${id}`));
  }
  res.status(200).send(p);
};

export const insertProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, pDescription, category, price, quantity, imageUrl } = req.body;

  if (
    !title ||
    !pDescription ||
    !category ||
    !price ||
    !quantity ||
    !imageUrl
  ) {
    return next(
      new BadRequestError(`Product model is missing required fields`)
    );
  }

  if (price <= 0 || quantity <= 0) {
    return next(new UnprocessableEntityError(`Product model fields not valid`));
  }

  const prod: ProductDto = {
    title,
    pDescription,
    category,
    price,
    quantity,
    imageUrl,
  };

  const p: ProductModel = await createProduct(prod);
  console.log('p :>> ', p.toJSON());

  if (!p) {
    return next(new ServiceUnavailableError('Database connection Error'));
  }
  res.status(200).send(p);
};
