import { QueryInterface, Sequelize } from 'sequelize';
import { Cart, Product } from '../models'; // Assicurati che il percorso sia corretto

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      const carts = await Cart.findAll({ attributes: ['id'] });
      const products = await Product.findAll({ attributes: ['id'] });

      if (!carts || carts.length === 0 || !products || products.length === 0) {
        console.warn(
          'Nessun carrello o prodotto trovato per creare gli elementi del carrello di esempio.'
        );
        return;
      }

      const cartItemsToSeed = [];
      let cartIndex = 0;
      let productIndex = 0;
      const numberOfCartItems = 5; // Numero di elementi del carrello di esempio da creare

      for (let i = 0; i < numberOfCartItems; i++) {
        cartItemsToSeed.push({
          CartId: carts[cartIndex].id,
          ProductId: products[productIndex].id,
          quantity: Math.floor(Math.random() * 3) + 1, // Quantità casuale da 1 a 3
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        cartIndex = (cartIndex + 1) % carts.length;
        productIndex = (productIndex + 1) % products.length;
      }

      await queryInterface.bulkInsert('CartItems', cartItemsToSeed);

      console.log('Elementi del carrello di esempio inseriti con successo.');
    } catch (error) {
      console.error(
        'Errore durante il seeding degli elementi del carrello:',
        error
      );
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.bulkDelete('CartItems', {}, {});
  },
};
