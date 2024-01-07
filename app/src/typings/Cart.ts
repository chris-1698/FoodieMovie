export type CartItem = {
  image: string | undefined;
  slug: string;
  quantity: number;
  countInStock: number;
  price: number;
  _id: string;
  name: string;
};

export type Cart = {
  cartItems: CartItem[];
  orderDetails: OrderDetails;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  totalPrice: number;
};

export type OrderDetails = {
  fullName: string;
  email: string;
  pickUpDate: string;
  pickUpTime: string;
  screenId: number;
  seatNumber: string;
};
