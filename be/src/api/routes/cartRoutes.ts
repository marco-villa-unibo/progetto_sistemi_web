import { Router } from 'express';
import { authenticate, isCustomer } from '../middlewares';
import {
  addItem,
  clearUserCart,
  getUserCart,
  removeItem,
  updateQuantity,
} from '../controllers/cartController';

export const cartRouter = Router();

/////////////////
// Cart routes //
/////////////////

/**
 * @openapi
 * /cart:
 *   get:
 *     tags:
 *       - cart
 *     summary: Retrieves logged user's cart.
 *     description: Retrieves logged user's cart items.
 *     operationId: getCart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartWithItems'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
cartRouter.get('/', authenticate, isCustomer, getUserCart);

/**
 * @openapi
 * /cart:
 *   delete:
 *     tags:
 *       - cart
 *     summary: Deletes logged user's cart.
 *     description: Removes all items in user's cart.
 *     operationId: deleteCart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Cart deleted
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
cartRouter.delete('/', authenticate, isCustomer, clearUserCart);

//////////////////////
// Cart/Item routes //
//////////////////////

/**
 * @openapi
 * /cart/items:
 *   post:
 *     tags:
 *       - cart items
 *     summary: Adds an item to logged user's cart.
 *     description: Adds an item and quantity to the cart.
 *     operationId: addCartItem
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemToCartRequest'
 *     responses:
 *       '201':
 *         description: Item added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartWithItems'
 *       '400':
 *         $ref: '#/components/responses/BadRequestError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '422':
 *         $ref: '#/components/responses/UnprocessableEntityError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
cartRouter.post('/items', authenticate, isCustomer, addItem);

/**
 * @openapi
 * /cart/items/{cartItemId}:
 *   put:
 *     tags:
 *       - cart items
 *     summary: Updates item's quantity in logged user's cart.
 *     description: Updates item's quantity in logged user's cart.
 *     operationId: updateCartItem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         description: ID dell'elemento del carrello da aggiornare.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemQuantityRequest'
 *     responses:
 *       '200':
 *         description: Item quantity successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartWithItems'
 *       '400':
 *         $ref: '#/components/responses/BadRequestError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '422':
 *         $ref: '#/components/responses/UnprocessableEntityError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
cartRouter.put('/items/:id', authenticate, isCustomer, updateQuantity);

/**
 * @openapi
 * /cart/items/{cartItemId}:
 *   delete:
 *     tags:
 *       - cart items
 *     summary: Deletes an item from logged user's cart.
 *     description: Deletes an item from logged user's cart.
 *     operationId: deleteCartItem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         description: ID dell'elemento del carrello da rimuovere.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Item deleted
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
cartRouter.delete('items/:id', authenticate, isCustomer, removeItem);
