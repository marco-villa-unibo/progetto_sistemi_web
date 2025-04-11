import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  insertProduct,
  modifyProduct,
  removeProduct,
} from '../controllers/productController';
import { authenticate } from '../middlewares';
import { isEmployee } from '../middlewares';

export const productRouter = Router();

/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - product
 *     summary: Finds all products in the store.
 *     description: Finds all products in the store.
 *     operationId: findAllProducts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductOutput'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
productRouter.get('/', getAllProducts);

/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - product
 *     summary: Add a new product to the store.
 *     description: Add a new product to the store, including image.
 *     operationId: addProduct
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Create a new product in the store
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *       required: true
 *     responses:
 *       '201':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOutput'
 *       '400':
 *         description: Invalid input
 *         $ref: '#/components/responses/BadRequestError'
 *       '422':
 *         description: Validation exception
 *         $ref: '#/components/responses/UnprocessableEntityError'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
productRouter.post('/', authenticate, isEmployee, insertProduct);

/**
 * @openapi
 * /product/{productId}:
 *   put:
 *     tags:
 *       - product
 *     summary: Update an existing product.
 *     description: Update an existing product by ID.
 *     operationId: updateProduct
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of product to return
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       description: Update an existing product in the store
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOutput'
 *       '400':
 *         description: Invalid ID supplied
 *         $ref: '#/components/responses/BadRequestError'
 *       '404':
 *         description: Product not found
 *         $ref: '#/components/responses/NotFoundError'
 *       '422':
 *         description: Validation exception
 *         $ref: '#/components/responses/UnprocessableEntityError'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
productRouter.put('/:id', authenticate, isEmployee, modifyProduct);

/**
 * @openapi
 *  /product/{productId}:
 *    get:
 *      tags:
 *        - product
 *      summary: Finds product by ID.
 *      description: Returns a single product.
 *      operationId: findProductById
 *      parameters:
 *        - name: productId
 *          in: path
 *          description: ID of product to return
 *          required: true
 *          schema:
 *            type: integer
 *            format: int64
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ProductOutput'
 *        '400':
 *          description: Invalid ID supplied
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          description: Product not found
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
productRouter.get('/:id', getProductById);

/**
 * @openapi
 * /product/{productId}:
 *   delete:
 *     tags:
 *       - product
 *     summary: Deletes a product.
 *     description: Delete a product.
 *     operationId: deleteProduct
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of product to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '204':
 *         description: Product deleted
 *       '400':
 *         description: Invalid ID supplied
 *         $ref: '#/components/responses/BadRequestError'
 *       '404':
 *         description: Product not found
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
productRouter.delete('/:id', authenticate, isEmployee, removeProduct);
