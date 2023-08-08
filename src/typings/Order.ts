import { CartItem, OrderDetails } from './Cart';
import { User } from './User';

export type Order = {
  _id: string;
  orderItems: CartItem[];
  user: User;
  orderDetails: OrderDetails;
  paymentMethod: string;
  createdAt: string;
  promoId: string;
  promoApplied: boolean;
  isPaid: boolean;
  paidAt: string;
  taxPrice: number;
  itemsPrice: number;
  totalPrice: number;
  pickUpCode: string;
};
