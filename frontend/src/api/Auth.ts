import AuthService from '@services/AuthService';
import FetchService from '@services/FetchService';
import {PostLoginParams, PostRegisterParams} from '@types';

export const postRegister = async ({
  full_name,
  phone_number,
  password,
  role,
}: PostRegisterParams) => {
  const fetch = FetchService();

  const data = await fetch('auth/register', {
    method: 'POST',
    body: {phone_number, password, full_name, role} as unknown as BodyInit_,
  });

  return data;
};

export const postLogin = async ({phone_number, password}: PostLoginParams) => {
  const fetch = FetchService();

  const data = await fetch('auth/token', {
    method: 'POST',
    body: {phone_number, password} as unknown as BodyInit_,
  });

  return data;
};

export const getProfile = async () => {
  const fetch = FetchService();

  const token = await AuthService.getToken();
  const data = await fetch(`auth/users/me?token=${token}`);

  return data;
};
