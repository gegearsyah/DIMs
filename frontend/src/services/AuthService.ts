import {KEYS} from '@enums';
import RNSecureStorage from 'rn-secure-storage';

export default (function AuthService() {
  const getToken = async () => await RNSecureStorage.getItem(KEYS.AUTH_TOKEN);
  const setToken = async (value: string) =>
    await RNSecureStorage.setItem(KEYS.AUTH_TOKEN, value, {});
  const removeToken = async () =>
    await RNSecureStorage.removeItem(KEYS.AUTH_TOKEN);

  const getUser = async () => await RNSecureStorage.getItem(KEYS.USER);
  const setUser = async (value: string) =>
    await RNSecureStorage.setItem(KEYS.USER, value, {});
  const removeUser = async () => await RNSecureStorage.removeItem(KEYS.USER);

  return {setToken, getToken, removeToken, getUser, setUser, removeUser};
})();
