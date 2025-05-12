import CryptoJS from 'crypto-js'

// Chave secreta para criptografia
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

const cryptoService = {
  // Criptografa um objeto ou string e retorna uma string segura
  encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
  },

  // Descriptografa uma string criptografada, retornando o objeto original
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (error) {
      console.error('Erro ao descriptografar os dados:', error)
      return null
    }
  },
}

export default cryptoService
