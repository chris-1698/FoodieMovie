import { CartItem, OrderDetails } from './Cart';
import { User } from './User';

export type Order = {
  _id: string;
  orderItems: CartItem[];
  orderDetails: OrderDetails;
  paymentMethod: string;
  user: User;
  createdAt: string;
  promoId: string;
  promoApplied: boolean;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: string;
  taxPrice: number;
  itemsPrice: number;
  totalPrice: number;
  pickUpCode: string;
};
