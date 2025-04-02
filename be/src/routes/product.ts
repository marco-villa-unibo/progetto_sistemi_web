import { Request, Router } from 'express';
import { ProductDto } from '../types';

export const router = Router();

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
router.get('/', (req: Request<{}, ProductDto[]>, res) => {
  const p: ProductDto = {
    id: 1,
    category: 'ORTOFRUTTA',
    imageUrl: 'img',
    pDescription: 'zucca',
    title: 'zucca',
    price: 2.99,
    quantity: 20,
  };
  res.status(200).send([p]);
});

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
 *      '422':
 *        description: Validation exception
 *      '500':
 *        description: Unexpected server error
 *        $ref: '#/components/responses/InternalServerError'
 */
router.post('/', (req: Request<ProductDto, ProductDto>, res) => {
  const p: ProductDto = {
    id: 1,
    category: 'ORTOFRUTTA',
    imageUrl: 'img',
    pDescription: 'zucca',
    title: 'zucca',
    price: 2.99,
    quantity: 20,
  };
  res.status(200).send(p);
});

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
 *       '404':
 *         description: Product not found
 *       '422':
 *         description: Validation exception
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/', (req: Request<ProductDto, ProductDto>, res) => {
  const p: ProductDto = {
    id: 1,
    category: 'ORTOFRUTTA',
    imageUrl: 'img',
    pDescription: 'zucca',
    title: 'zucca',
    price: 2.99,
    quantity: 20,
  };
  res.status(200).send(p);
});

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
 *        '404':
 *          description: Product not found
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', (req: Request<{ id: number }, ProductDto>, res) => {
  const p: ProductDto = {
    id: 1,
    category: 'ORTOFRUTTA',
    imageUrl: 'img',
    pDescription: 'zucca',
    title: 'zucca',
    price: 2.99,
    quantity: 20,
  };
  res.status(200).send(p);
});

/**
 * @openapi
 *  /product/{productId}:
 *    delete:
 *      tags:
 *        - product
 *      summary: Deletes a product.
 *      description: Delete a product (safe).
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
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', (req: Request<{ id: number }>, res) => {
  res.status(204).end();
});
