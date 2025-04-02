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
