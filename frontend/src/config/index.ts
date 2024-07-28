import local from './local';
import development from './development';
import production from './production';

const Config = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;

    case 'development':
      return development;

    default:
      return local;
  }
})();

export default Config;
