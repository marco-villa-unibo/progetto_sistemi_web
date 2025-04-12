// import { QueryInterface, Sequelize } from 'sequelize';
// import { User } from '../models'; // Assicurati che il percorso sia corretto

// module.exports = {
//   up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
//     try {
//       const users = await User.findAll({ attributes: ['id'] });

//       if (!users || users.length === 0) {
//         console.warn('Nessun utente trovato per creare i carrelli di esempio.');
//         return;
//       }

//       const cartsToSeed = users.map(user => ({
//         UserId: user.id,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }));

//       await queryInterface.bulkInsert('Carts', cartsToSeed);

//       console.log('Carrelli di esempio inseriti con successo.');
//     } catch (error) {
//       console.error('Errore durante il seeding dei carrelli:', error);
//     }
//   },

//   down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
//     await queryInterface.bulkDelete('Carts', {}, {});
//   },
// };
