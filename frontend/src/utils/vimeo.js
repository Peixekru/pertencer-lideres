import { nextTick } from 'vue'

/**
 * Promise única para garantir que a API do Vimeo seja carregada apenas uma vez.
 * Evita múltiplos `<script>` injetados no DOM em cenários de SPA com navegação dinâmica.
 */
let vimeoScriptPromise = null

/**
 * Carrega dinamicamente o script da API do Vimeo (player.js).
 *
 * Reutiliza uma Promise singleton (`vimeoScriptPromise`) para garantir carregamento único.
 * Retorna a Promise que será resolvida assim que o script for carregado com sucesso.
 *
 * @returns {Promise<void>} Promise resolvida após a API ser carregada
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
 * Inicializa o(s) player(s) do Vimeo presentes na página e escuta o evento 'ended'.
 *
 * - Aguarda o carregamento da API oficial do Vimeo (player.js)
 * - Busca todos os `<iframe>` com `src*="player.vimeo.com"`
 * - Instancia um player para cada iframe
 * - Registra um listener para o evento `ended`, chamando o callback `onEnd`
 *
 * Essa função é ideal para ambientes SPA onde os iframes são carregados dinamicamente
 * e a API precisa ser reaplicada a cada montagem de componente.
 *
 * @param {Function} onEnd - Callback executado quando o vídeo chega ao fim
 */
export async function initVimeoPlayer(onEnd) {
  await loadVimeoAPI()
  await nextTick()

  const vimeoIframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]')

  if (!vimeoIframes.length) {
    console.warn('[initVimeoPlayer] Nenhum iframe do Vimeo encontrado no DOM')
    return
  }

  vimeoIframes.forEach((iframe, index) => {
    const player = new window.Vimeo.Player(iframe)

    player
      .ready()
      .then(() => {
        console.log(`[initVimeoPlayer] Player Vimeo #${index + 1} pronto`)
      })
      .catch((err) => {
        console.error('[initVimeoPlayer] Erro ao preparar player Vimeo:', err)
      })

    player.on('ended', () => {
      console.log(`[initVimeoPlayer] Player Vimeo #${index + 1} chegou ao fim`)
      onEnd?.()
    })
  })
}
