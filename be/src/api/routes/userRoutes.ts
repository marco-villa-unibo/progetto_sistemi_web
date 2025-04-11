import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  modifyUser,
  removeUser,
} from '../controllers/userController';
import { authenticate } from '../middlewares';
import { isAdmin } from '../middlewares';

export const userRouter = Router();

// FIXME - refactor (in vista di signup login e jwt)

/**
 * @openapi
 *  /user:
 *    get:
 *      tags:
 *        - user
 *      summary: Finds all users in the store.
 *      description: Finds all users in the store.
 *      operationId: findAllUsers
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/UserOutput'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.get('/', authenticate, isAdmin, getAllUsers);

/**
 * @openapi
 *  /user:
 *    put:
 *      tags:
 *        - user
 *      summary: Update an existing user.
 *      description: Update an existing user by ID.
 *      operationId: updateUser
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: ID of user to update
 *          required: true
 *          schema:
 *            type: integer
 *            format: int64
 *      requestBody:
 *        description: Update an existing user in the store
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *        required: true
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserOutput'
 *        '400':
 *          description: Invalid ID supplied
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          description: User not found
 *          $ref: '#/components/responses/NotFoundError'
 *        '422':
 *          description: Validation exception
 *          $ref: '#/components/responses/UnprocessableEntityError'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.put('/', authenticate, isAdmin, modifyUser);

/**
 * @openapi
 *  /user/{userId}:
 *    get:
 *      tags:
 *        - user
 *      summary: Finds user by ID.
 *      description: Returns a single user.
 *      operationId: findUserById
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: ID of user to return
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
 *                $ref: '#/components/schemas/UserOutput'
 *        '400':
 *          description: Invalid ID supplied
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          description: User not found
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.get('/:id', authenticate, isAdmin, getUserById);

/**
 * @openapi
 *  /user/{userId}:
 *    delete:
 *      tags:
 *        - user
 *      summary: Deletes a user.
 *      description: Delete a user.
 *      operationId: deleteUser
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: ID of user to delete
 *          required: true
 *          schema:
 *            type: integer
 *            format: int64
 *      responses:
 *        '204':
 *          description: User deleted
 *        '400':
 *          description: Invalid ID supplied
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          description: User not found
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.delete('/:id', authenticate, isAdmin, removeUser);
