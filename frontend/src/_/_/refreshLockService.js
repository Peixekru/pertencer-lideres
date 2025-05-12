const REFRESH_LOCK_KEY = 'refresh_in_progress';
const LOCK_TIMEOUT = 10 * 1000; // 10 segundos

const refreshLockService = {
  setLock() {
    const payload = {
      timestamp: Date.now(),
    };
    localStorage.setItem(REFRESH_LOCK_KEY, JSON.stringify(payload));
  },

  removeLock() {
    localStorage.removeItem(REFRESH_LOCK_KEY);
  },

  isLocked() {
    const data = localStorage.getItem(REFRESH_LOCK_KEY);
    if (!data) return false;

    try {
      const { timestamp } = JSON.parse(data);
      const now = Date.now();
      return now - timestamp < LOCK_TIMEOUT;
    } catch {
      return false;
    }
  },

  async waitForUnlock(interval = 200, timeout = 5000) {
    const start = Date.now();

    return new Promise((resolve) => {
      const check = () => {
        const isCurrentlyLocked = refreshLockService.isLocked();
        const timeElapsed = Date.now() - start;
        if (!isCurrentlyLocked || timeElapsed > timeout) {
          resolve();
        } else {
          setTimeout(check, interval);
        }
      };
      check();
    });
  }
};

export default refreshLockService;
