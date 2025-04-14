// test/utils/mockDatabase.ts
import {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
} from '../../db/models';

export const mockDatabase = () => {
  const mockedUser = jest.mock(
    '../../db/models/User.ts'
  ) as unknown as jest.Mocked<typeof User>;
  const mockedProduct = jest.mock(
    '../../db/models/Product'
  ) as unknown as jest.Mocked<typeof Product>;
  const mockedCart = jest.mock(
    '../../db/models/Cart'
  ) as unknown as jest.Mocked<typeof Cart>;
  const mockedCartItem = jest.mock(
    '../../db/models/CartItem'
  ) as unknown as jest.Mocked<typeof CartItem>;
  const mockedOrder = jest.mock(
    '../../db/models/Order'
  ) as unknown as jest.Mocked<typeof Order>;
  const mockedOrderItem = jest.mock(
    '../../db/models/OrderItem'
  ) as unknown as jest.Mocked<typeof OrderItem>;

  return {
    mockedUser,
    mockedProduct,
    mockedCart,
    mockedCartItem,
    mockedOrder,
    mockedOrderItem,
  };
};
