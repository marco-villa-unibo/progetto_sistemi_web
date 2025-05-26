import { QueryInterface } from 'sequelize';
import { UserInput } from '../models/User';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    try {
      const usersToSeed = [
        {
          username: 'Marco',
          firstName: 'Marco',
          lastName: 'Villa',
          email: 'test@example.com',
          passwordHash:
            '$2b$10$107d6FK6AqAtDmAyhRQ3DONAQ6v1L24y48wBPxrWvQgSXMXUuzh1q', // Password1!
          phone: '333-1234567',
          address: 'via Roma, 1 - Cesena',
          userRole: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Leo',
          firstName: 'Leonardo',
          lastName: 'Garuti',
          email: 'test2@example.com',
          passwordHash:
            '$2b$10$107d6FK6AqAtDmAyhRQ3DONAQ6v1L24y48wBPxrWvQgSXMXUuzh1q', // Password1!
          phone: '333-7654321',
          address: 'via Roma, 1 - Cesena',
          userRole: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Prof',
          firstName: 'Chiara',
          lastName: 'Ceccarini',
          email: 'test3@example.com',
          passwordHash:
            '$2b$10$107d6FK6AqAtDmAyhRQ3DONAQ6v1L24y48wBPxrWvQgSXMXUuzh1q', // Password1!
          phone: '333-7654321',
          address: 'via Roma, 1 - Cesena',
          userRole: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // 3. Inserisci i prodotti nella tabella Products
      await queryInterface.bulkInsert('Users', usersToSeed);
      // await User.bulkCreate(usersToSeed);

      console.log('Dati dei prodotti inseriti con chiavi esterne UserId.');
    } catch (error) {
      console.error('Errore durante il seeding dei prodotti:', error);
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.bulkDelete('Users', { username: ['1', '2'] });
  },
};
