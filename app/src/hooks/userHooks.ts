import { useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { UserInfo } from '../typings/UserInfo';
import { stringToPath } from 'sanity';

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      lastName,
      email,
      password,
      dateOfBirth,
    }: {
      name: string;
      lastName: string;
      email: string;
      password: string;
      dateOfBirth: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/register`, {
          name,
          lastName,
          email,
          password,
          dateOfBirth,
        })
      ).data,
  });
