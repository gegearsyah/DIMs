import AuthService from './AuthService';
import FetchService from './FetchService';

const SecureFetchService = () => {
  return AuthService.getToken()
    .then(token => {
      const fetch = FetchService({
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return (url: string, options?: RequestInit) => fetch(url, options);
    })
    .catch(err => {
      throw err;
    });
};

export default SecureFetchService;
