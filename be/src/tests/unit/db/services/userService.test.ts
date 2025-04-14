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

    // Crea un mock per l'istanza del modello User
    const mockUserInstance = {
      ...mockUser,
      update: jest.fn().mockResolvedValue([1]), // Simula la funzione update sull'istanza
    };

    findByPkSpy = jest.spyOn(User, 'findByPk');
    updateSpy = jest.spyOn(User, 'update');
  });

  afterEach(() => {
    findByPkSpy.mockRestore();
    updateSpy.mockRestore();
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

  describe('updateUserById', () => {
    it('should update the user if found and return the updated user', async () => {
      const updatedData = { firstName: 'Updated', phone: '0987654321' };
      const updatedUser = { ...mockUser, ...updatedData };
      const findByPkAfterUpdateSpy = jest
        .spyOn(User, 'findByPk')
        .mockResolvedValue(updatedUser as any);

      const user = await userService.updateUserById(
        1,
        updatedData as Partial<UserInput>
      );
      expect(user).toEqual(updatedUser);
      expect(findByPkSpy).toHaveBeenCalledWith(1);
      expect(updateSpy).toHaveBeenCalledWith(updatedData);
      expect(findByPkAfterUpdateSpy).toHaveBeenCalledWith(1);
    });

    it('should return null if the user to update is not found', async () => {
      findByPkSpy.mockResolvedValue(null);
      const updatedData = { firstName: 'Updated' };
      const user = await userService.updateUserById(
        99,
        updatedData as Partial<UserInput>
      );
      expect(user).toBeNull();
      expect(findByPkSpy).toHaveBeenCalledWith(99);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should handle errors from the database during findByPk', async () => {
      const errorMessage = 'Database error during find';
      findByPkSpy.mockRejectedValue(new Error(errorMessage));
      const updatedData = { firstName: 'Updated' };

      await expect(
        userService.updateUserById(1, updatedData as Partial<UserInput>)
      ).rejects.toThrow(errorMessage);
      expect(findByPkSpy).toHaveBeenCalledWith(1);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should handle errors from the database during update', async () => {
      findByPkSpy.mockResolvedValue(mockUser as any);
      const errorMessage = 'Database update error';
      updateSpy.mockRejectedValue(new Error(errorMessage));
      const updatedData = { firstName: 'Updated' };

      await expect(
        userService.updateUserById(1, updatedData as Partial<UserInput>)
      ).rejects.toThrow(errorMessage);
      expect(findByPkSpy).toHaveBeenCalledWith(1);
      expect(updateSpy).toHaveBeenCalledWith(updatedData);
    });

    it('should return the original user object with updated properties if findByPk after update fails', async () => {
      const updatedData = { lastName: 'NewLastName' };
      findByPkSpy.mockResolvedValue(mockUser as any);
      updateSpy.mockResolvedValue([1]);
      const findByPkAfterUpdateSpy = jest
        .spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('Failed to fetch updated user'));

      const user = await userService.updateUserById(
        1,
        updatedData as Partial<UserInput>
      );
      expect(user).toEqual({ ...mockUser, ...updatedData }); // Potrebbe dipendere dalla tua implementazione
      expect(findByPkSpy).toHaveBeenCalledWith(1);
      expect(updateSpy).toHaveBeenCalledWith(updatedData);
      expect(findByPkAfterUpdateSpy).toHaveBeenCalledWith(1);
    });

    it('should not call update if no data to update is provided', async () => {
      findByPkSpy.mockResolvedValue(mockUser as any);
      const user = await userService.updateUserById(1, {});
      expect(user).toEqual(mockUser);
      expect(findByPkSpy).toHaveBeenCalledWith(1);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
