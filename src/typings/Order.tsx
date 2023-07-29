import { CartItem } from './Cart';

export type Order = {
  _id: string;
  orderItems: CartItem[];
  clientId: string;
  clientFullName: string;
  clientEmail: string;
  pickUpDate: string;
  pickUptime: string;
  paymentMethod: string;
  createdAt: string;
  promoId: string;
  promoApplied: boolean;
  isPaid: boolean;
  taxPrice: number;
  itemsPrice: number;
  totalPrice: number;
  pickUpCode: string;
};
