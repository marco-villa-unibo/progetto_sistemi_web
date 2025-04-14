import * as userService from '../../../../db/services/userService';
import { User } from '../../../../db/models';
import { UserInput, UserOutput } from '../../../../db/models/User';
import { mockDatabase } from '../../../utils/mockDatabase';

const { mockedUser } = mockDatabase();

describe('UserService', () => {
  let mockUser: UserOutput;
  let mockUserInput: UserInput;
  let findByPkSpy: jest.SpyInstance;
  let updateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks(); // Resetta i mock prima di ogni test

    mockUser = {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      address: 'Test Address',
      userRole: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserInput = {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password1!',
      phone: '1234567890',
      address: 'Test Address',
      userRole: 'ADMIN',
    };

    findByPkSpy = jest.spyOn(User, 'findByPk');
  });

  describe('findUserById', () => {
    it('should return the user if found', async () => {
      findByPkSpy.mockResolvedValue(mockUser as any);
      const user = await userService.findUserById(1);
      expect(user).toEqual(mockUser);
      expect(findByPkSpy).toHaveBeenCalledWith(1);
    });

    it('should return null if the user is not found', async () => {
      findByPkSpy.mockResolvedValue(null);
      const user = await userService.findUserById(99);
      expect(user).toBeNull();
      expect(findByPkSpy).toHaveBeenCalledWith(99);
    });

    it('should handle errors from the database', async () => {
      const errorMessage = 'Database error';
      findByPkSpy.mockRejectedValue(new Error(errorMessage));

      await expect(userService.findUserById(1)).rejects.toThrow(errorMessage);
    });
  });

  // ... altri test
});
