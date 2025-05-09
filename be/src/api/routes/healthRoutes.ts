import { Request, Response, Router } from 'express';
import { HealthResponseDTO } from '../types';
import { authenticate, isEmployee, isAdmin } from '../middlewares';

export const healthRouter = Router();

const resOk = (req: Request<{}, HealthResponseDTO>, res: Response) => {
  res.send({ status: 'OK', timestamp: req.timestamp! });
};

/**
 * @openapi
 * /health/customer:
 *   get:
 *     description: Health check endpoint for Shop API
 *     operationId: healthCustomer
 *     tags:
 *       - health
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRouter.get('/customer', resOk);

/**
 * @openapi
 * /health/employee:
 *   get:
 *     description: Health check endpoint for Shop API
 *     operationId: healthEmployee
 *     tags:
 *       - health
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRouter.get('/employee', authenticate, isEmployee, resOk);

/**
 * @openapi
 * /health/admin:
 *   get:
 *     description: Health check endpoint for Shop API
 *     operationId: healthAdmin
 *     tags:
 *       - health
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRouter.get('/admin', authenticate, isAdmin, resOk);
