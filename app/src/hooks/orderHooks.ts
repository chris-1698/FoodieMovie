// Tanstack resources
import { useMutation, useQuery } from '@tanstack/react-query';

// Project resources
import { CartItem, OrderDetails } from '../typings/Cart';
import apiClient from '../apiClient';
import { Order } from '../typings/Order';

// Endpoint to get an order's details according to its id
export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

// PayPal endpoint
export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  });

// Endpoint to get the order history for a user
export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine/orderHistory`)).data,
  });

// Endpoint to get all orders
export const useGetAllOrdersQuery = () =>
  useQuery({
    queryKey: ['all-orders'],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`api/orders/all/allOrders`)).data,
  });

// Endpoint to get those orders which pickup code matches searchTerm
export const useGetSomeOrdersQuery = (searchTerm: string) =>
  useQuery({
    queryKey: ['some-orders', searchTerm],
    queryFn: async () =>
      (
        await apiClient.get<Order[]>(
          `api/orders/orders/searchOrder/${searchTerm}`
        )
      ).data,
  });

// Endpoint to set an order as delivered
export const useDeliverOrderMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (
        await apiClient.put<string>(`api/orders/order/deliverOrder`, {
          id,
        })
      ).data,
  });

export const useConfirmOrderMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (
        await apiClient.put<string>(`api/orders/order/confirmOrder`, {
          id,
        })
      ).data,
  });

// Endpoint to create a new order
export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      orderDetails: OrderDetails;
      paymentMethod: string;
      itemsPrice: number;
      taxPrice: number;
      totalPrice: number;
      isPaid: boolean;
      isDelivered: boolean;
      paidAt: string;
      isCancelled: boolean;
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });

// Endpoint to set an order as paid
export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          { details } //Contains payment result. Email address and other info.
        )
      ).data,
  });

// export const useCancelOrderMutation = () =>
//   useMutation({
//     mutationFn: async ({ orderId }: { orderId: string }) =>
//       (
//         await apiClient.put<string>(`api/orders/order/cancelOrder`, {
//           orderId,
//         })
//       ).data,
//   });

export const useCancelOrderMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (
        await apiClient.put<string>(`api/orders/order/cancelOrder`, {
          id,
        })
      ).data,
  });
