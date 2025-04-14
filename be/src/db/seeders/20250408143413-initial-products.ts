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
          title: 'quaderno righe',
          pDescription: 'quaderno a righe (seed deterministico)',
          category: 'BANCO',
          price: 4.99,
          quantity: 200,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(), // Data fissa
          updatedAt: new Date(),
        },
        {
          title: 'quaderno quadri',
          pDescription: 'quaderno a quadri (seed deterministico)',
          category: 'BANCO',
          price: 5.99,
          quantity: 150,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'penna rossa',
          pDescription: 'penna stilografica rossa (seed deterministico)',
          category: 'BANCO',
          price: 2.5,
          quantity: 300,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'mela golden',
          pDescription: 'mela golden delicious (seed deterministico)',
          category: 'ORTOFRUTTA',
          price: 1.2,
          quantity: 500,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'banana ecuador',
          pDescription: 'banana di alta qualità (seed deterministico)',
          category: 'ORTOFRUTTA',
          price: 0.8,
          quantity: 400,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'smart tv 55 pollici',
          pDescription: 'smart tv led 4k (seed deterministico)',
          category: 'ELETTRONICA',
          price: 499.99,
          quantity: 50,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'smartphone ultimo modello',
          pDescription:
            'smartphone di punta con fotocamera avanzata (seed deterministico)',
          category: 'ELETTRONICA',
          price: 999.0,
          quantity: 30,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'divano 3 posti',
          pDescription: 'comodo divano in tessuto (seed deterministico)',
          category: 'CASA',
          price: 350.0,
          quantity: 100,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'tavolo da pranzo',
          pDescription:
            'tavolo in legno massello per 6 persone (seed deterministico)',
          category: 'CASA',
          price: 280.0,
          quantity: 80,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'gelato alla vaniglia',
          pDescription:
            'confezione di gelato alla vaniglia (seed deterministico)',
          category: 'SURGELATI',
          price: 3.5,
          quantity: 200,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'pizza surgelata margherita',
          pDescription:
            'pizza margherita pronta da infornare (seed deterministico)',
          category: 'SURGELATI',
          price: 2.8,
          quantity: 250,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'vino rosso sangiovese',
          pDescription:
            'bottiglia di vino rosso sangiovese (seed deterministico)',
          category: 'LIQUORI',
          price: 8.99,
          quantity: 100,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'birra artigianale ipa',
          pDescription: 'confezione da 6 birre ipa (seed deterministico)',
          category: 'LIQUORI',
          price: 12.5,
          quantity: 80,
          imageUrl: 'public/images/1744416484806-image.png',
          UserId: users[1].id,
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
