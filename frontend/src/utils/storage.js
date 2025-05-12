import crypto from './crypto'

const storageService = {
  // Salva um item no localStorage, com opção de criptografar
  setItem(key, value, encrypt = false) {
    const data = encrypt ? crypto.encrypt(value) : value
    localStorage.setItem(key, data)
  },
  // Recupera um item do localStorage, com opção de descriptografar
  getItem(key, decrypt = false) {
    const data = localStorage.getItem(key)
    return decrypt && data ? crypto.decrypt(data) : data
  },
  // Remove um item do localStorage
  removeItem(key) {
    localStorage.removeItem(key)
  },
}

export default storageService
