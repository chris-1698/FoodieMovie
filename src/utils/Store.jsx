import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userinfo: localStorage.getItem('userInfo')
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(localStorage.getItem('userInfo'))
    : null,

  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : 'PayPal',
    itemsPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      //Si ya tengo el producto, lo actualizo. Si no, me quedo con el nuevo.
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : //Se añade el producto al final del array de cartItems si no existe
          [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_SIGNIN': {
      return { ...state, userInfo: action.payload };
    }

    case 'SAVE_ORDER_DETAILS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          orderDetails: action.payload,
        },
      };
    }
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}
// Acceso al contexto
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
