import CryptoJS from 'crypto-js';
import logger from '#logger';

const SECRET_KEY = 'minha-chave-secreta';

const cryptoService = {
    encrypt(data) {
        logger.inf('login - para criptografar', data)
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    },

    decrypt(encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null;
        }
    },
};

export default cryptoService;