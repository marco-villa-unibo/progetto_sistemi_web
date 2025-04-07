import { NextFunction, Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  findProductById,
  updateProductById,
} from '../../db/services/productService';
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
  ServiceUnavailableError,
} from '../error';
import { ProductDTO } from '../types';
import { ModelCtor } from 'sequelize';
import { UserOutput } from '../../db/models/User';
import { findUserById } from '../../db/services/userService';
import { ProductInput, ProductOutput } from '../../db/models/Product';

interface ProdRequest extends Request {
  body: ProductDTO;
  params: { id: string };
}

export const insertProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, pDescription, category, price, quantity, imageUrl } = req.body;
  const userId: number = req.userId! | 1;

  // 400 BAD REQUEST gestita dalla validazione openapi

  // TODO: gestire validazione lato DB
  if (price <= 0 || quantity <= 0) {
    return next(new UnprocessableEntityError(`Product model fields not valid`));
  }

  // retrieve User
  const user = await findUserById(userId);
  if (!user) {
    return next(
      new UnprocessableEntityError(`User not found for ID ${userId}`)
    );
  }

  const prod: ProductInput = {
    title,
    pDescription,
    category,
    price,
    quantity,
    imageUrl,
    user,
  };

  const p: ProductDTO = await createProduct(prod);
  console.log('p :>> ', p);

  // if (!p) {
  //   return next(new ServiceUnavailableError('Database connection Error'));
  // }
  res.status(200).send(p);
};

export const getAllProducts = async (
  req: ProdRequest,
  res: Response<ProductDTO[]>
) => {
  const p: ProductDTO[] = await fetchAllProducts();
  res.status(200).send(p);
};

export const getProductById = async (
  req: ProdRequest,
  res: Response<ProductDTO>,
  next: NextFunction
) => {
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

export const removeProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // TODO: trasferire controllo a validazione yaml
  if (isNaN(+id) || +id <= 0) {
    return next(new BadRequestError(`Product ID must be positive integer`));
  }

  const p = await deleteProduct(+id);
  if (!p) {
    return next(new NotFoundError(`Product not found for ID ${id}`));
  }

  res.status(204).end();
};

export const modifyProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id, title, pDescription, category, price, quantity, imageUrl } =
    req.body;

  // 400 BAD REQUEST gestita dalla validazione openapi

  // TODO: trasferire controllo a validazione yaml
  if (!id || isNaN(id) || id <= 0) {
    return next(new BadRequestError(`Product ID must be positive integer`));
  }

  // TODO: gestire validazione lato DB
  // if (price <= 0 || quantity <= 0) {
  //   return next(new UnprocessableEntityError(`Product model fields not valid`));
  // }

  const prod: ProductDTO = {
    title,
    pDescription,
    category,
    price,
    quantity,
    imageUrl,
  };

  const [p] = await updateProductById(id, prod);
  if (p === 0) {
    return next(new NotFoundError(`Product not found for ID ${id}`));
  }

  const r = await findProductById(+id);
  res.status(200).send(r);
};
