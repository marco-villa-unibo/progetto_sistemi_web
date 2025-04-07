import { Request, Router } from 'express';
import { HealthResponseDTO } from '../types';

export const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     description: Health check endpoint for Shop API
 *     operationId: healthCheck
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
healthRouter.get('/', (req: Request<{}, HealthResponseDTO>, res) => {
  res.send({ status: 'OK', timestamp: req.timestamp! });
});
