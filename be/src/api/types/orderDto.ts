import { createEnumObjectFromType } from '../../utils/helpers';
import { components } from '../schemas';

// ORDER
export type OrderDTO = components['schemas']['Order'];
export type OrderItemDTO = components['schemas']['OrderItem'];
export type OrderWithItemsDTO = components['schemas']['OrderWithItems'];
export type CreateOrderRequestDTO = components['schemas']['CreateOrderRequest'];
export type UpdateOrderStatusRequestDTO =
  components['schemas']['UpdateOrderStatusRequest'];

// ORDER STATUS
export type OrderStatusDTO = components['schemas']['OrderStatus'];

export const OrderStatusEnum = createEnumObjectFromType<OrderStatusDTO>({
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
});
