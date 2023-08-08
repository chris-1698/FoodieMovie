import { ApiError } from '../typings/ApiError';
import { CartItem } from '../typings/Cart';

/**
 * Frontend common resources
 */

export const convertProductToCartitem = (product): CartItem => {
  const cartItem: CartItem = {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    quantity: 1,
  };
  return cartItem;
};

export const getError = (error: ApiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
