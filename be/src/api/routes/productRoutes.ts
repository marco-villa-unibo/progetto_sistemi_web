import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  insertProduct,
  modifyProduct,
  removeProduct,
} from '../controllers/productController';

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
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
productRouter.get('/', getAllProducts);

/**
 * @openapi
 * /product:
 *  post:
 *    tags:
 *      - product
 *    summary: Add a new product to the store.
 *    description: Add a new product to the store.
 *    operationId: addProduct
 *    requestBody:
 *      description: Create a new product in the store
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *      required: true
 *    responses:
 *      '200':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      '400':
 *        description: Invalid input
 *        $ref: '#/components/responses/BadRequestError'
 *      '422':
 *        description: Validation exception
 *        $ref: '#/components/responses/UnprocessableEntityError'
 *      '500':
 *        description: Unexpected server error
 *        $ref: '#/components/responses/InternalServerError'
 */
productRouter.post('/', insertProduct);

/**
 * @openapi
 * /product:
 *   put:
 *     tags:
 *       - product
 *     summary: Update an existing product.
 *     description: Update an existing product by ID.
 *     operationId: updateProduct
 *     requestBody:
 *       description: Update an existing product in the store
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
productRouter.put('/', modifyProduct);

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
 *                $ref: '#/components/schemas/Product'
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
 *  /product/{productId}:
 *    delete:
 *      tags:
 *        - product
 *      summary: Deletes a product.
 *      description: Delete a product.
 *      operationId: deleteProduct
 *      parameters:
 *        - name: productId
 *          in: path
 *          description: ID of product to delete
 *          required: true
 *          schema:
 *            type: integer
 *            format: int64
 *      responses:
 *        '204':
 *          description: Product deleted
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
productRouter.delete('/:id', removeProduct);
