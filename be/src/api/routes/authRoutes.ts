import { Router } from 'express';

import { register, login } from '../controllers/authController';

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Register a new user.
 *     description: Register a new user with CUSTOMER role.
 *     operationId: register
 *     requestBody:
 *       description: Create a new user
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *       required: true
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
authRouter.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login an existing user and get a JWT token.
 *     description: Login a user.
 *     operationId: login
 *     requestBody:
 *       description: Login an existing user
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *       required: true
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserOutput'
 *       '401':
 *         description: Invalid credentials
 *         $ref: '#/components/responses/InvalidCredentialsError'
 *       '500':
 *         description: Unexpected server error
 *         $ref: '#/components/responses/InternalServerError'
 */
authRouter.post('/login', login);
