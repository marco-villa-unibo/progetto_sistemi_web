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
import path from 'path';

dotenv.config();

interface ProdRequest extends Request {
  // user: IUserJwtPayload;
  body: ProductDTO;
  params: { id: string };
}

// TODO --- GESTIONE IMMAGINI (middleware dedicato per User avatar ) ---
const handleImageUpload = (req: ProdRequest): string | undefined => {
  if (!req.file) {
    return undefined;
  }
  return path.join(
    process.env.IMAGE_UPLOAD_FOLDER || 'public/images/',
    sanitizeFilename(req.file.filename)
  );
};

export const insertProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { price, quantity } = req.body;
  const userId: number = req.user!.userId;

  const imagePath = handleImageUpload(req);
  if (!imagePath) {
    return next(new UnprocessableEntityError('Product image not provided'));
  }

  if (Number(price) <= 0 || Number(quantity) <= 0) {
    return next(new UnprocessableEntityError(`Product model fields not valid`));
  }

  const user = await findUserById(userId);
  if (!user) {
    return next(
      new UnprocessableEntityError(`User not found for ID ${userId}`)
    );
  }

  const newProd: ProductInput = {
    ...req.body,
    imageUrl: imagePath,
    UserId: user.id,
  };
  try {
    const p: ProductOutput = await createProduct(newProd);
    res.status(201).send(p);
  } catch (error) {
    return next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response<ProductDTO[]>,
  next: NextFunction
) => {
  try {
    const p: ProductOutput[] = await fetchAllProducts();
    res.status(200).send(p);
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (
  req: ProdRequest,
  res: Response<ProductDTO>,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(new BadRequestError('Product ID must be a positive integer'));
  }
  try {
    const p = await findProductById(+id);
    if (!p) {
      return next(new NotFoundError(`Product not found for ID ${id}`));
    }
    res.status(200).send(p);
  } catch (error) {
    return next(error);
  }
};

export const removeProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(new BadRequestError('Product ID must be a positive integer'));
  }

  try {
    const d = await deleteProductById(+id);
    if (!d) {
      return next(new NotFoundError(`Product not found for ID ${id}`));
    }

    res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export const modifyProduct = async (
  req: ProdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { price, quantity } = req.body;
  const userId: number = req.user!.userId;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(new BadRequestError('Product ID must be a positive integer'));
  }

  if (price !== undefined && Number(price) <= 0) {
    return next(new BadRequestError('Price must be a positive number'));
  }

  if (
    (quantity !== undefined && !Number.isInteger(Number(quantity))) ||
    Number(quantity) < 0
  ) {
    return next(new BadRequestError('Quantity must be a non-negative integer'));
  }

  const prod: Partial<ProductInput> = {
    ...req.body,
    UserId: userId,
  };

  const imageUrl = handleImageUpload(req);
  if (imageUrl) {
    prod.imageUrl = imageUrl;
  }

  try {
    const p = await updateProductById(+id, prod);
    if (!p) {
      return next(new NotFoundError(`Product not found for ID ${id}`));
    }
    const r = await findProductById(+id);

    res.status(200).send(r);
  } catch (error) {
    return next(error);
  }
};
