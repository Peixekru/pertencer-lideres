import storage from './storage'

const REFRESH_LOCK_KEY = 'refresh_in_progress'
const LOCK_TIMEOUT = 10 * 1000 // 10 segundos

const refreshLockService = {
  // Cria um lock com timestamp atual
  setLock() {
    // Salva o lock com timestamp atual
    storage.setItem(REFRESH_LOCK_KEY, { timestamp: Date.now() })
  },
  // Remove o lock
  removeLock() {
    storage.removeItem(REFRESH_LOCK_KEY)
  },
  // Verifica se o lock está ativo e dentro do tempo limite
  isLocked() {
    // Recupera o lock
    const data = storage.getItem(REFRESH_LOCK_KEY)
    // Se não houver lock, retorna false
    if (!data || !data.timestamp) return false
    // Verifica se o lock está dentro do tempo limite
    return Date.now() - data.timestamp < LOCK_TIMEOUT
  },
  // Espera o lock ser liberado ou até o timeout ser atingido
  async waitForUnlock(interval = 200, timeout = 5000) {
    const start = Date.now()
    // Cria um loop que verifica o lock a cada intervalo de tempo
    return new Promise((resolve) => {
      const check = () => {
        // Verifica se o lock está ativo e se o tempo limite foi atingido
        const locked = refreshLockService.isLocked()
        const expired =
          Date.now() - start >
          timeout(
            // Se não estiver mais ativo ou o tempo limite foi atingido, resolve
            !locked || expired,
          )
            ? resolve()
            : setTimeout(check, interval)
      }
      // Inicia a verificação
      check()
    })
  },
}

export default refreshLockService
