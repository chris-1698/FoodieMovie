import { useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { UserInfo } from '../typings/UserInfo';

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

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: async ({ email }: { email: string }) =>
      (
        await apiClient.post<string>(`api/users/forgot-password`, {
          email,
        })
      ).data,
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: async ({
      password,
      token,
    }: {
      password: string;
      token: string;
    }) =>
      (
        await apiClient.post<string>(`api/users/reset-password`, {
          password,
          token,
        })
      ).data,
  });

export const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: async ({ email }: { email: string }) =>
      (
        await apiClient.delete<string>(`api/users/delete-user`, {
          data: {
            email,
          },
        })
      ).data,
  });
