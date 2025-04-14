import { Router } from 'express';
import {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderStatusAdmin,
} from '../controllers/orderController';
import { authenticate, isAdmin } from '../middlewares';

export const orderRouter = Router();

/**
 * @openapi
 * /order:
 *   post:
 *     tags:
 *       - orders
 *     summary: Places a new order form logged user's cart.
 *     description: Places a new order form logged user's cart. Deletes the cart after creation.
 *     operationId: addOrder
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       '201':
 *         description: Ordine creato con successo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithItems'
 *       '400':
 *         $ref: '#/components/responses/BadRequestError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError' # Se il carrello è vuoto
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
orderRouter.post('/', authenticate, createOrder);

/**
 * @openapi
 * /order:
 *   get:
 *     tags:
 *       - orders
 *     summary: Retrieves all logged user's orders.
 *     description: Retrieves all logged user's orders.
 *     operationId: getAllOrders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Ordini recuperati con successo.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
orderRouter.get('/', authenticate, getUserOrders);

/**
 * @openapi
 * /order/{orderId}:
 *   get:
 *     tags:
 *       - orders
 *     summary: Retrieves a specific logged user's order.
 *     description: Retrieves an order by ID, giving that it belongs to the logged user.
 *     operationId: getOrderById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID dell'ordine da recuperare.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ordine recuperato con successo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithItems'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         $ref: '#/components/responses/ForbiddenError' # Se l'ordine non appartiene all'utente
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
orderRouter.get('/:orderId', authenticate, getOrder);

/**
 * @openapi
 * /order/{orderId}/status:
 *   patch:
 *     tags:
 *       - orders
 *     summary: Updates order status (Admin only).
 *     description: Allows admins to update the status of a specific order
 *     operationId: updateOrderStatus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID dell'ordine da aggiornare.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Stato dell'ordine aggiornato con successo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         $ref: '#/components/responses/BadRequestError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         $ref: '#/components/responses/ForbiddenError' # Se l'utente non è Admin
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
orderRouter.patch(
  '/:orderId/status',
  authenticate,
  isAdmin,
  updateOrderStatusAdmin
);
