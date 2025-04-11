import { Request, Response, NextFunction } from 'express';
import {
  addItemToCart,
  getCartWithItemsByUserId,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
} from '../../db/services/cartService';
import {
  AddItemToCartRequestDTO,
  CartWithItemsDTO,
  UpdateCartItemQuantityRequestDTO,
} from '../types';
import { BadRequestError, NotFoundError } from '../error';

export const getUserCart = async (
  req: Request,
  res: Response<CartWithItemsDTO>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const cart = await getCartWithItemsByUserId(userId);
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(200).send({ id: undefined, UserId: userId, cartItems: [] }); // Carrello vuoto
    }
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (
  req: Request,
  res: Response<CartWithItemsDTO>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const addItemDto: AddItemToCartRequestDTO = req.body;
    const updatedCart = await addItemToCart(
      userId,
      addItemDto.ProductId,
      addItemDto.quantity
    );
    res.status(201).send(updatedCart);
  } catch (error) {
    return next(error);
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const cartItemId = parseInt(req.params.cartItemId, 10);

    if (isNaN(cartItemId)) {
      return next(
        new BadRequestError(
          `Cart item with ID ${cartItemId} not found in your cart`
        )
      );
    }

    const removed = await removeItemFromCart(userId, cartItemId);

    if (removed) {
      res.status(204).end();
    } else {
      return next(
        new NotFoundError(
          `Cart item with ID ${cartItemId} not found in your cart`
        )
      );
    }
  } catch (error) {
    return next(error);
  }
};

export const updateQuantity = async (
  req: Request,
  res: Response<CartWithItemsDTO>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const cartItemId = parseInt(req.params.cartItemId, 10);
    const updateQuantityDto: UpdateCartItemQuantityRequestDTO = req.body;

    if (isNaN(cartItemId)) {
      return next(new BadRequestError('Invalid Cart Item ID'));
    }

    const updatedItem = await updateCartItemQuantity(
      userId,
      cartItemId,
      updateQuantityDto.quantity
    );

    if (updatedItem) {
      const updatedCart = await getCartWithItemsByUserId(userId);
      res.status(200).send(updatedCart!);
    } else {
      return next(
        new NotFoundError(
          `Cart item with ID ${cartItemId} not found in your cart`
        )
      );
    }
  } catch (error) {
    return next(error);
  }
};

export const clearUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const cleared = await clearCart(userId);

    if (cleared) {
      res.status(204).end();
    }
  } catch (error) {
    return next(error);
  }
};
