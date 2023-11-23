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
// TODO: Revisar,
// https://www.youtube.com/watch?v=EirJor7TgXQ&ab_channel=CodingwithBasir
// 8:28
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
