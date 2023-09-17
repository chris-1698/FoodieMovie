import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';
import { Cart, CartItem, OrderDetails } from '../typings/Cart';
import { UserInfo } from '../typings/UserInfo';

type AppState = {
	darkMode: boolean
	cart: Cart
	userInfo?: UserInfo
}

const initialState: AppState = {
	userInfo: localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo')!)
		: null,
	darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems')!)
			: [],
		orderDetails: localStorage.getItem('orderDetails')
			? JSON.parse(localStorage.getItem('orderDetails')!)
			: {},
		paymentMethod: localStorage.getItem('paymentMethod')
			? localStorage.getItem('paymentMethod')!
			: 'PayPal',
		itemsPrice: 0,
		taxPrice: 0,
		totalPrice: 0
	}
}

type Action =
	| { type: 'DARK_MODE_ON' }
	| { type: 'DARK_MODE_OFF' }
	| { type: 'CART_ADD_ITEM'; payload: CartItem }
	| { type: 'CART_REMOVE_ITEM'; payload: CartItem }
	| { type: 'CART_CLEAR', }
	| { type: 'USER_SIGN_IN'; payload: UserInfo }
	| { type: 'USER_SIGN_OUT' }
	| { type: 'SAVE_ORDER_DETAILS', payload: OrderDetails }
	| { type: 'SAVE_PAYMENT_METHOD', payload: string }

function reducer(state: AppState, action: Action): AppState {
	localStorage.setItem('darkMode', state.darkMode === true ? 'ON' : 'OFF');
	switch (action.type) {
		case 'DARK_MODE_ON':
			return { ...state, darkMode: true };
		case 'DARK_MODE_OFF':
			return { ...state, darkMode: false };
		case 'CART_ADD_ITEM':
			const newItem = action.payload
			const existItem = state.cart.cartItems.find(
				(item: CartItem) => item._id === newItem._id
			)
			const cartItems = existItem
				? state.cart.cartItems.map((item: CartItem) =>
					item._id === existItem._id ? newItem : item
				)
				: [...state.cart.cartItems, newItem]

			localStorage.setItem('cartItems', JSON.stringify(cartItems))
			return { ...state, cart: { ...state.cart, cartItems } }
		case 'CART_REMOVE_ITEM': {
			const cartItems = state.cart.cartItems.filter(
				(item: CartItem) => item._id !== action.payload._id
			)
			localStorage.setItem('cartItems', JSON.stringify(cartItems))
			return { ...state, cart: { ...state.cart, cartItems } }
		}
		case 'CART_CLEAR': {
			return { ...state, cart: { ...state.cart, cartItems: [] } }
		}
		case 'USER_SIGN_IN':
			return { ...state, userInfo: action.payload }
		case 'USER_SIGN_OUT':
			return {
				darkMode: window.matchMedia('prefers-color-scheme: dark').matches
					? true :
					false,
				cart: {
					cartItems: [],
					paymentMethod: 'PayPal',
					orderDetails: {
						fullName: '',
						email: '',
						pickUpDate: '',
						pickUpTime: '',
					},
					itemsPrice: 0,
					taxPrice: 0,
					totalPrice: 0
				}
			}
		case 'SAVE_ORDER_DETAILS':
			return {
				...state,
				cart: {
					...state.cart,
					orderDetails: action.payload
				}
			}
		case 'SAVE_PAYMENT_METHOD':
			return {
				...state,
				cart: { ...state.cart, paymentMethod: action.payload }
			}
		default:
			return state
	}
}

const defaultDispatch: React.Dispatch<Action> = () => initialState

const Store = React.createContext({
	state: initialState,
	dispatch: defaultDispatch,
})

function StoreProvider(props: React.PropsWithChildren<{}>) {
	const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
		reducer,
		initialState
	)
	return <Store.Provider value={{ state, dispatch }} {...props} />
}

export { Store, StoreProvider }