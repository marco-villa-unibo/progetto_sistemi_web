import { Op, QueryInterface } from 'sequelize';
import { User } from '../models'; // Assicurati che il percorso sia corretto
import { sequelizeConnection } from '../dbConfig';
import { ProductInput } from '../models/Product';

const testSuffix = '__TEST';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    try {
      await sequelizeConnection.authenticate(); // Verifica la connessione
      console.log('Database connesso per il seeding dei prodotti.');

      // 1. Recupera gli utenti esistenti (o creane di nuovi)
      const existingUsers = await User.findAll();

      if (!existingUsers || existingUsers.length === 0) {
        console.warn(
          'Nessun utente trovato. Assicurati che la tabella Users sia popolata.'
        );
        return; // Esci dal seeder se non ci sono utenti
      }

      // 2. Prepara i dati dei prodotti, assegnando un UserId casuale (o specifico)
      const productsToSeed: ProductInput[] = [
        {
          title: 'quaderno righe',
          pDescription: 'quaderno a righe',
          category: 'BANCO',
          price: '4.99',
          quantity: '200',
          imageUrl: 'http://localhost:8080/img/img1.jpg',
          UserId: existingUsers[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'quaderno quadri',
          pDescription: 'quaderno a quadri',
          category: 'BANCO',
          price: '5.99',
          quantity: '200',
          imageUrl: 'http://localhost:8080/img/img1.jpg',
          UserId: existingUsers[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'penna',
          pDescription: 'penna rossa',
          category: 'ORTOFRUTTA',
          price: '4.99',
          quantity: '200',
          imageUrl: 'http://localhost:8080/img/img1.jpg',
          UserId: existingUsers[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // 3. Inserisci i prodotti nella tabella Products
      await queryInterface.bulkInsert('Products', productsToSeed);
      // await Product.bulkCreate(productsToSeed);

      console.log('Dati dei prodotti inseriti con chiavi esterne UserId.');
    } catch (error) {
      console.error('Errore durante il seeding dei prodotti:', error);
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.bulkDelete('Products', {
      title: { [Op.like]: `%${testSuffix}` },
    }); // Elimina tutti i prodotti (attenzione in produzione!)
  },
};
