const API_BASE = import.meta.env.VITE_API_URL

/**
 * Retorna a URL absoluta da imagem ou recurso, ou um fallback se inválida
 * @param {string} apiPath - Caminho relativo da API
 * @param {string} fallback - Caminho alternativo caso o apiPath seja inválido
 * @returns {string}
 */
export function getUrl(apiPath, fallback) {
  return apiPath && !apiPath.includes('undefined') && !apiPath.includes('null')
    ? `${API_BASE}/${apiPath}`
    : fallback
}
