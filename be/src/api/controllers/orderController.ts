import { Request, Response, NextFunction } from 'express';
import {
  createOrderFromCart,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from '../../db/services/orderService';
import {
  CreateOrderRequestDTO,
  OrderWithItemsDTO,
  OrderStatusEnum,
  OrderDTO,
} from '../types';
import { BadRequestError, NotFoundError, ForbiddenError } from '../error';

export const createOrder = async (
  req: Request,
  res: Response<OrderWithItemsDTO>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const orderData: CreateOrderRequestDTO = req.body;
    const newOrder = await createOrderFromCart(userId, orderData);
    if (newOrder) {
      // Send confirmation e-mail to the user
      // mailingService(
      //   newUser.email,
      //   'New order placed',
      //   '<h1>CONGRATULATIONS</h1><br> You successfully placed your order!'
      // );
      res.status(201).send(newOrder);
    } else {
      next(new NotFoundError("Impossibile creare l'ordine dal carrello."));
    }
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response<OrderWithItemsDTO>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const orderId = parseInt(req.params.orderId, 10);

    if (isNaN(orderId) || orderId <= 0) {
      return next(new BadRequestError("ID dell'ordine non valido."));
    }

    const order = await getOrderById(orderId, userId);

    if (!order) {
      return next(
        new NotFoundError(
          `Ordine con ID ${orderId} non trovato o non appartenente all'utente.`
        )
      );
    }

    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (
  req: Request,
  res: Response<OrderDTO[]>,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const orders = await getOrdersByUserId(userId);
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (
  req: Request,
  res: Response<OrderDTO>,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return next(
        new ForbiddenError(
          'Solo gli amministratori possono aggiornare lo stato degli ordini.'
        )
      );
    }

    const orderId = parseInt(req.params.orderId, 10);
    const { orderStatus } = req.body;

    if (isNaN(orderId) || orderId <= 0) {
      return next(new BadRequestError("ID dell'ordine non valido."));
    }

    if (!Object.values(OrderStatusEnum).includes(orderStatus)) {
      return next(new BadRequestError("Stato dell'ordine non valido."));
    }

    const updatedOrder = await updateOrderStatus(orderId, orderStatus);

    if (!updatedOrder) {
      return next(new NotFoundError(`Ordine con ID ${orderId} non trovato.`));
    }

    res.status(200).send(updatedOrder);
  } catch (error) {
    next(error);
  }
};
