// import { request } from '../helpers';

// import * as userService from '../../db/services/userService';
// import { UserOutput } from '../../db/models/User';

// // Mock del userService per isolare il controller
// jest.mock('../../../src/db/services/userService');
// const mockedUserService = userService as jest.Mocked<typeof userService>;

// describe('UserController Integration Tests', () => {
//   const mockAdminToken = 'testAdminToken'; // Simula un token JWT di amministratore

//   beforeEach(() => {
//     // Simula il middleware di autenticazione e isAdmin
//     jest
//       .spyOn(require('../../../src/middlewares/authenticate'), 'authenticate')
//       .mockImplementation((req: any, res: any, next: any) => {
//         req.user = { id: 1, username: 'admin', userRole: 'ADMIN' } as any; // Simula un utente admin autenticato
//         next();
//       });

//     jest
//       .spyOn(require('../../../src/middlewares/isAdmin'), 'isAdmin')
//       .mockImplementation((req: any, res: any, next: any) => {
//         if (req.user && req.user.userRole === 'ADMIN') {
//           next();
//         } else {
//           res.sendStatus(403); // Forbidden
//         }
//       });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('GET /users', () => {
//     it('should return 200 OK and an array of users if admin', async () => {
//       const mockUsers: UserOutput[] = [
//         {
//           id: 1,
//           username: 'user1',
//           firstName: 'User',
//           lastName: 'One',
//           email: 'user1@example.com',
//           phone: '123',
//           address: 'addr1',
//           userRole: 'ADMIN',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           id: 2,
//           username: 'user2',
//           firstName: 'User',
//           lastName: 'Two',
//           email: 'user2@example.com',
//           phone: '456',
//           address: 'addr2',
//           userRole: 'ADMIN',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ];
//       mockedUserService.fetchAllUsers.mockResolvedValue(mockUsers);

//       const response = await request
//         .get('/users')
//         .set('Authorization', `Bearer ${mockAdminToken}`); // Simula l'header di autorizzazione

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(
//         mockUsers.map(user => ({
//           id: user.id,
//           username: user.username,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           phone: user.phone,
//           address: user.address,
//           userRole: user.userRole,
//           createdAt: expect.any(String), // Convertito in stringa da Express
//           updatedAt: expect.any(String),
//         }))
//       );
//       expect(mockedUserService.fetchAllUsers).toHaveBeenCalledTimes(1);
//     });
//   });

//   // Aggiungere test
// });

// FIXME
