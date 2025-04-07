import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  insertUser,
  modifyUser,
  removeUser,
} from '../controllers/userController';

export const userRouter = Router();

/**
 * @openapi
 *  /user:
 *    get:
 *      tags:
 *        - user
 *      summary: Finds all users in the store.
 *      description: Finds all users in the store.
 *      operationId: findAllUsers
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.get('/', getAllUsers);

/**
 * @openapi
 *  /user:
 *    post:
 *      tags:
 *        - user
 *      summary: Add a new user.
 *      description: Add a new user with CUSTOMER role.
 *      operationId: addUser
 *      requestBody:
 *        description: Create a new user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *        required: true
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        '400':
 *          description: Invalid input
 *          $ref: '#/components/responses/BadRequestError'
 *        '422':
 *          description: Validation exception
 *          $ref: '#/components/responses/UnprocessableEntityError'
 *        '500':
 *          description: Unexpected server error
 *          $ref: '#/components/responses/InternalServerError'
 */
userRouter.post('/', insertUser);

/**
 * @openapi
 *  /user:
 *    put:
 *      tags:
 *        - user
 *      summary: Update an existing user.
 *      description: Update an existing user by ID.
 *      operationId: updateUser
 *      requestBody:
 *        description: Update an existing user in the store
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *        required: true
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
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
userRouter.put('/', modifyUser);

/**
 * @openapi
 *  /user/{userId}:
 *    get:
 *      tags:
 *        - user
 *      summary: Finds user by ID.
 *      description: Returns a single user.
 *      operationId: findUserById
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
 *                $ref: '#/components/schemas/User'
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
userRouter.get('/:id', getUserById);

/**
 * @openapi
 *  /user/{userId}:
 *    delete:
 *      tags:
 *        - user
 *      summary: Deletes a user.
 *      description: Delete a user.
 *      operationId: deleteUser
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
userRouter.delete('/:id', removeUser);
