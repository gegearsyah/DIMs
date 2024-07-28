import {getProfile, postLogin, postRegister} from '@api/Auth';
import AuthService from '@services/AuthService';
import {PostLoginParams, PostRegisterParams, UserData} from '@types';
import React, {createContext, useContext, useEffect, useState} from 'react';

export const AuthContext = createContext<{
  user?: UserData;
  token?: string;
  register: (params: PostRegisterParams) => Promise<void>;
  login: (params: PostLoginParams) => Promise<void>;
}>({register: async () => {}, login: async () => {}});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<UserData>();
  const [token, setToken] = useState<string>();

  const register = async (params: PostRegisterParams) => {
    const res = await postRegister(params);
    return res;
  };

  const login = async (params: PostLoginParams) => {
    const {access_token} = await postLogin(params);
    await AuthService.setToken(access_token);

    const user = await getProfile();
    await AuthService.setUser(JSON.stringify(user));

    setToken(access_token);
    setUser(user);
  };

  const logout = async () => {
    await AuthService.removeToken();
    await AuthService.removeUser();
    setToken(undefined);
    setUser(undefined);
  };

  useEffect(() => {
    (async () => {
      const user = await AuthService.getUser().catch(() => null);
      const token = await AuthService.getToken().catch(() => null);

      if ((user?.length ?? 0) > 0) setUser(JSON.parse(user!!));
      if ((token?.length ?? 0) > 0) setToken(token!!);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{user, token, register, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
