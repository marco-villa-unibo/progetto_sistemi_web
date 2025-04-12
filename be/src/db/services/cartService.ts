import { Cart, CartItem, Product } from '../models';
import { CartItemDTO, CartWithItemsDTO } from '../../api/types';

export const getCartByUserId = async (userId: number): Promise<Cart | null> => {
  return Cart.findOne({ where: { UserId: userId } });
};

export const getCartWithItemsByUserId = async (
  userId: number
): Promise<CartWithItemsDTO | null> => {
  return Cart.findOne({
    where: { UserId: userId },
    include: [
      {
        model: CartItem,
        as: 'cartItems',
        include: [
          {
            model: Product,
            as: 'product', // Se vuoi includere anche i dettagli del prodotto
          },
        ],
      },
    ],
  }) as unknown as CartWithItemsDTO | null; // Type assertion necessaria a causa dell'include
};

export const createCart = async (userId: number): Promise<Cart> => {
  return Cart.create({ UserId: userId });
};

export const addItemToCart = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<CartWithItemsDTO> => {
  let cart = await getCartByUserId(userId);

  if (!cart) {
    cart = await createCart(userId);
  }

  const existingCartItem = await CartItem.findOne({
    where: { CartId: cart.id, ProductId: productId },
  });

  if (existingCartItem) {
    await existingCartItem.update({
      quantity: existingCartItem.quantity + quantity,
    });
    return getCartWithItemsByUserId(userId) as Promise<CartWithItemsDTO>;
  } else {
    await CartItem.create({ CartId: cart.id, ProductId: productId, quantity });
    return getCartWithItemsByUserId(userId) as Promise<CartWithItemsDTO>;
  }
};

export const removeItemFromCart = async (
  userId: number,
  cartItemId: number
): Promise<boolean> => {
  const cart = await getCartByUserId(userId);
  if (!cart) {
    return false; // Carrello non trovato per l'utente
  }

  const deletedRows = await CartItem.destroy({
    where: { id: cartItemId, CartId: cart.id },
  });

  return deletedRows > 0;
};

export const updateCartItemQuantity = async (
  userId: number,
  cartItemId: number,
  quantity: number
): Promise<CartItemDTO | null> => {
  const cart = await getCartByUserId(userId);
  if (!cart) {
    return null; // Carrello non trovato per l'utente
  }

  const cartItem = await CartItem.findOne({
    where: { id: cartItemId, CartId: cart.id },
  });

  if (!cartItem) {
    return null; // Elemento del carrello non trovato
  }

  await cartItem.update({ quantity });
  return cartItem.get({ plain: true }) as CartItemDTO;
};

export const clearCart = async (userId: number): Promise<boolean> => {
  const cart = await getCartByUserId(userId);
  if (!cart) {
    return false; // Carrello non trovato per l'utente
  }

  const deletedRows = await CartItem.destroy({
    where: { CartId: cart.id },
  });

  return deletedRows > 0;
};
