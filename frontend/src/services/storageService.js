import cryptoService from './cryptoService';
import logger from '#logger';

const storageService = {
  setItem(key, value, encrypt = false) {
    const data = encrypt ? cryptoService.encrypt(value) : value;
    localStorage.setItem(key, data);

    logger.inf('login - salva no localstorage', key, data)
  },

  getItem(key, decrypt = false) {
    const data = localStorage.getItem(key);
    return decrypt && data ? cryptoService.decrypt(data) : data;
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },
};

export default storageService;
