import { Op, QueryInterface, Sequelize } from 'sequelize';
import { User } from '../models';
import { sequelizeConnection } from '../dbConfig';
import { ProductInput } from '../models/Product';

const testSuffix = '__TEST';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await sequelizeConnection.authenticate();
      console.log(
        'Database connesso per il seeding dei prodotti (generazione deterministica).'
      );

      // 1. Recupera gli utenti esistenti (o creane di nuovi con ID specifici per il test)
      const users = await User.findAll({ order: [['id', 'ASC']], limit: 2 }); // Ottieni i primi 2 utenti in modo consistente

      if (!users || users.length < 2) {
        console.warn(
          'Meno di 2 utenti trovati. Assicurati che la tabella Users abbia almeno 2 record per un seeding deterministico.'
        );
        return;
      }

      const productsToSeed: ProductInput[] = [
        {
          title: 'Sangiovese',
          pDescription: 'Vino rosso (seed deterministico)',
          category: 'LIQUORI',
          price: 14.99,
          quantity: 200,
          imageUrl: 'public/images/1744416484001-image.jpg',
          UserId: users[0].id,
          createdAt: new Date(), // Data fissa
          updatedAt: new Date(),
        },
        {
          title: 'Quaderno righe',
          pDescription: 'quaderno a righe (seed deterministico)',
          category: 'CASA',
          price: 5.99,
          quantity: 150,
          imageUrl: 'public/images/1744416484002-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Minestrone',
          pDescription: 'Minestrone (seed deterministico)',
          category: 'BANCO',
          price: 2.5,
          quantity: 300,
          imageUrl: 'public/images/1744416484003-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Penna BIC',
          pDescription: 'Penna blu (seed deterministico)',
          category: 'CASA',
          price: 1.2,
          quantity: 500,
          imageUrl: 'public/images/1744416484004-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Candele',
          pDescription: 'Candele profumate (seed deterministico)',
          category: 'CASA',
          price: 18,
          quantity: 400,
          imageUrl: 'public/images/1744416484005-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Amaro Montenegro',
          pDescription: 'amaro (seed deterministico)',
          category: 'LIQUORI',
          price: 29.99,
          quantity: 50,
          imageUrl: 'public/images/1744416484006-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Smartphone I-Phone 16',
          pDescription:
            'smartphone di punta con fotocamera avanzata (seed deterministico)',
          category: 'ELETTRONICA',
          price: 999.0,
          quantity: 30,
          imageUrl: 'public/images/1744416484007-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Gaming PC',
          pDescription: 'PC (seed deterministico)',
          category: 'ELETTRONICA',
          price: 1350.0,
          quantity: 100,
          imageUrl: 'public/images/1744416484008-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Anelli all Romana',
          pDescription: 'Anelli all romana pronti (seed deterministico)',
          category: 'SURGELATI',
          price: 6.0,
          quantity: 80,
          imageUrl: 'public/images/1744416484009-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Sedia Gaming',
          pDescription: 'sedia ergonomica (seed deterministico)',
          category: 'ELETTRONICA',
          price: 133.5,
          quantity: 200,
          imageUrl: 'public/images/1744416484010-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('Products', productsToSeed);

      console.log('Dati dei prodotti inseriti (seed deterministico).');
    } catch (error) {
      console.error('Errore durante il seeding dei prodotti:', error);
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.bulkDelete('Products', {
      pDescription: { [Op.like]: '%(seed deterministico)%' },
    });
  },
};
