import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPlaceholder, size } from '@/utils/placeholder'
import api from '@/composables/useApi'

// URL da API (sem /api)
const API_BASE = import.meta.env.VITE_API_URL

export const useSpaceStore = defineStore(
  'space',
  () => {
    // Estado reativo
    const space = ref(null)
    const defaultColor = '#f5f5f5'

    // --------------------------------------------------
    // Ações
    // --------------------------------------------------

    // Busca space pelo slug
    async function fetchSpace(slug = 'pertencer_lideres') {
      const response = await api.get(`/space/${slug}`)
      // Atualiza estado com space
      space.value = response.data
    }
    // Gera URL completa ou retorna fallback se inválida
    function getUrl(path, fallback) {
      // Verifica se o caminho é válido
      return path && !path.includes('undefined') && !path.includes('null')
        ? `${API_BASE}/${path}`
        : fallback
    }

    // --------------------------------------------------
    // Logos e ícones
    // --------------------------------------------------

    // Retorna URL completa da logo ou fallback
    const getLoginLogoUrl = () => getUrl(space.value?.login_logo_url, getPlaceholder(size.login))
    // Retorna URL completa do ícone ou fallback
    const getLoginIconUrl = () => getUrl(space.value?.login_icon_url, getPlaceholder(size.icon))
    // Retorna URL completa do favicon ou fallback
    const getFaviconUrl = () => getUrl(space.value?.favicon_url, getPlaceholder(size.favicon))
    // Retorna URL completa do logo do rodapé ou fallback
    const getFooterLogoUrl = () => getUrl(space.value?.footer_logo_url, getPlaceholder(size.footer))
    // Retorna título da página
    const getPageTitle = () => space.value?.page_title || 'Oops'

    // --------------------------------------------------
    // Estilos visuais
    // --------------------------------------------------

    // Retorna estilo de cor de fundo
    const getBackgroundColorStyle = () => {
      // Se não houver space, retorna cor de fundo padrão
      if (!space.value) return { backgroundColor: defaultColor }

      // Se houver space, retorna cor de fundo linear ou simples
      const c1 = space.value.login_background_color_1
      const c2 = space.value.login_background_color_2
      // Se houver duas cores, retorna gradiente linear
      if (c1 && c2) {
        return { background: `linear-gradient(to bottom, ${c1}, ${c2})` }
      }
      // Se houver uma cor, retorna cor simples
      if (c1) {
        return { backgroundColor: c1 }
      }
      // Se não houver cores, retorna cor de fundo padrão
      return { backgroundColor: defaultColor }
    }
    // Retorna estilo de imagem de fundo
    const getBackgroundImageStyle = () => {
      // Se não houver space, retorna objeto vazio
      const url = space.value?.login_background_image_url
      if (!url) return {}
      // Se houver space, retorna objeto com estilo de imagem
      return {
        backgroundImage: `url(${getUrl(url)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }

    // --------------------------------------------------
    // Exposição pública
    // --------------------------------------------------

    // Retorna objeto com métodos e estados
    return {
      space,
      fetchSpace,
      getLoginLogoUrl,
      getLoginIconUrl,
      getFaviconUrl,
      getFooterLogoUrl,
      getPageTitle,
      getBackgroundColorStyle,
      getBackgroundImageStyle,
    }
  },
  {
    // Persistência no localStorage
    persist: {
      storage: localStorage,
      paths: ['space'],
    },
  },
)
