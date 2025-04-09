import { NextFunction, Request, Response } from 'express';
import {
  createProduct,
  deleteProductById,
  fetchAllProducts,
  findProductById,
  updateProductById,
} from '../../db/services/productService';
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from '../error';
import { ProductDTO } from '../types';
import { ProductInput, ProductOutput } from '../../db/models/Product';
import { findUserById } from '../../db/services/userService';
import { sanitizeFilename } from '../../utils/helpers';
import dotenv from 'dotenv';

dotenv.config();
interface ProdRequest extends Request {
  body: ProductDTO;
  params: { id: string };
}

export const insertProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { price, quantity } = req.body;

  //REVIEW - : prendere lo user id dall'utente loggato (e verificare permessi)
  const userId: number = req.userId! | 1;

  // costruisco il percorso del file
  if (!req.file) {
    return next(new UnprocessableEntityError(`Product image not provided`));
  }
  const imagePath =
    process.env.IMAGE_UPLOAD_FOLDER + sanitizeFilename(req.file.filename);

  // 400 BAD REQUEST gestita dalla validazione openapi

  // TODO: gestire validazione lato DB
  if (Number(price) <= 0 || Number(quantity) <= 0) {
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
    ...req.body,
    imageUrl: imagePath,
    UserId: user.id,
  };

  const p: ProductOutput = await createProduct(prod);

  res.status(201).send(p);
};

export const getAllProducts = async (
  req: ProdRequest,
  res: Response<ProductDTO[]>
) => {
  const p: ProductOutput[] = await fetchAllProducts();
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

  const p = await deleteProductById(+id);
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
  // const { id } = req.params;
  // const { price, quantity } = req.body;
  // // 400 BAD REQUEST gestita dalla validazione openapi
  // // TODO: trasferire controllo a validazione yaml
  // if (!id || isNaN(+id) || +id <= 0) {
  //   return next(new BadRequestError(`Product ID must be positive integer`));
  // }
  // // TODO: gestire validazione lato DB
  // if (price <= 0 || quantity <= 0) {
  //   return next(new BadRequestError(`Product model fields not valid`));
  // }
  // const p = await updateProductById(+id, req.body);
  // if (!p) {
  //   return next(new NotFoundError(`Product not found for ID ${id}`));
  // }
  // res.status(200).send(p);
};
