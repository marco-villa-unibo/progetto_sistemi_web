('use strict');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: '1',
        firstName: 'Marco',
        lastName: 'Villa',
        email: 'test@example.com',
        password: 'password',
        phone: '333-1234567',
        address: 'via Roma, 1 - Cesena',
        userRole: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: '2',
        firstName: 'Leonardo',
        lastName: 'Garuti',
        email: 'test2@example.com',
        password: 'password',
        phone: '333-7654321',
        address: 'via Roma, 1 - Cesena',
        userRole: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { username: ['1', '2'] });
  },
};
