import { CartItem } from './CartItem';
import { UserInfo } from './UserInfo';
import { OrderDetails } from './OrderDetails';

export type Order = {
  _id: string;
  orderItems: CartItem[];
  user: UserInfo;
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
