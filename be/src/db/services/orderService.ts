import { Order, OrderItem, Product } from '../models';
import {
  CreateOrderRequestDTO,
  OrderDTO,
  OrderWithItemsDTO,
  OrderItemDTO,
  OrderStatusEnum,
  OrderStatusDTO,
} from '../../api/types';
import { clearCart, getCartWithItemsByUserId } from './cartService';
import { NotFoundError } from '../../api/error';

export const createOrderFromCart = async (
  userId: number,
  orderData: CreateOrderRequestDTO
): Promise<OrderWithItemsDTO | null> => {
  try {
    const cartWithItems = await getCartWithItemsByUserId(userId);

    if (
      !cartWithItems ||
      !cartWithItems.cartItems ||
      cartWithItems.cartItems.length === 0
    ) {
      throw new NotFoundError('Il carrello è vuoto.');
    }

    const newOrder = await Order.create({
      UserId: userId,
      orderDate: String(new Date()),
      totalAmount: 0, // Calcolato in seguito
      orderStatus: OrderStatusEnum.PENDING,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
    });

    let totalAmount = 0;
    const orderItems: OrderItemDTO[] = [];

    for (const cartItem of cartWithItems.cartItems) {
      const product = await Product.findByPk(cartItem.ProductId);
      if (!product) {
        throw new NotFoundError(
          `Prodotto con ID ${cartItem.ProductId} non trovato.`
        );
      }

      const orderItem = await OrderItem.create({
        OrderId: newOrder.id,
        ProductId: cartItem.ProductId,
        quantity: cartItem.quantity,
        unitPrice: product.price,
      });
      totalAmount += orderItem.quantity * orderItem.unitPrice;
      orderItems.push(orderItem);
    }

    newOrder.totalAmount = totalAmount;
    await newOrder.save();

    await clearCart(userId); // Svuota il carrello dopo l'ordine

    return {
      ...newOrder.get({ plain: true }),
      orderItems: orderItems.map((item: any) => item.get({ plain: true })),
    };
  } catch (error) {
    // In caso di errore del DB
    console.error(
      "Errore durante la creazione dell'ordine (senza transazione):",
      error
    );
    throw error;
  }
};

export const getOrderById = async (
  orderId: number,
  userId?: number
): Promise<OrderWithItemsDTO | null> => {
  const whereClause: any = { id: orderId };
  if (userId) {
    whereClause.UserId = userId;
  }

  return Order.findOne({
    where: whereClause,
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      },
    ],
  }) as unknown as OrderWithItemsDTO | null;
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  return Order.findAll({
    where: { UserId: userId },
    order: [['orderDate', 'DESC']],
  });
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatusDTO
): Promise<OrderDTO | null> => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new NotFoundError(`Ordine con ID ${orderId} non trovato.`);
  }
  await order.update({ orderStatus: status });
  return order;
};
