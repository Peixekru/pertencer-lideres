import { nextTick } from 'vue'

// Garante que a API do Vimeo seja carregada apenas uma vez.
// Reutiliza a mesma Promise em chamadas subsequentes, evitando múltiplos <script>.
let vimeoScriptPromise = null

/**
 * Carrega a API do Vimeo uma única vez.
 */
function loadVimeoAPI() {
  if (vimeoScriptPromise) return vimeoScriptPromise

  vimeoScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return vimeoScriptPromise
}

/**
 * Instancia player do Vimeo para cada iframe encontrado e escuta evento 'ended'.
 * Usa DOM direto para garantir que o player seja carregado corretamente mesmo após navegação SPA.
 *
 * @param {Function} onEnd - Função callback chamada ao final do vídeo
 */
export async function initVimeoPlayer(onEnd) {
  await loadVimeoAPI()
  await nextTick()

  const vimeoIframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]')

  if (!vimeoIframes.length) {
    console.warn('Nenhum iframe do Vimeo encontrado no DOM')
    return
  }

  vimeoIframes.forEach((iframe, index) => {
    const player = new window.Vimeo.Player(iframe)

    player
      .ready()
      .then(() => {
        console.log(`Player Vimeo #${index + 1} pronto`)
      })
      .catch((err) => {
        console.error('Erro ao preparar player Vimeo:', err)
      })

    player.on('ended', () => {
      console.log('Vimeo chegou ao fim do vídeo')
      onEnd?.()
    })
  })
}
