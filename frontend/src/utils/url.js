const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '')

/**
 * Retorna a URL absoluta da imagem ou recurso, ou um fallback se inválida
 * @param {string} path - Caminho relativo da API
 * @param {string} fallback - Caminho alternativo caso o path seja inválido
 * @returns {string}
 */
export function getUrl(path, fallback) {
  return path && !path.includes('undefined') && !path.includes('null')
    ? `${API_BASE}/${path}`
    : fallback
}
