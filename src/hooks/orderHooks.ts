import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { CartItem, OrderDetails } from '../typings/Cart';
import apiClient from '../apiClient';
import { Order } from '../typings/Order';

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      orderDetails: OrderDetails;
      paymentMethod: string;
      itemsPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });
// {
//   // data: {
//   //   order: {
//   //     _id: '9902234';
//   //   }
//   // }
// }
