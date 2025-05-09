import { defineStore } from 'pinia'
import { getPlaceholder, size } from '@/utils/placeholder'
import spaceService from '@/services/spaceService'

const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '')

export const useSpaceStore = defineStore('space', {
  // Estado inicial
  state: () => ({
    space: null,
    defaultColor: '#f5f5f5',
  }),

  // Persistência
  persist: {
    storage: localStorage,
    paths: ['space'],
  },

  actions: {
    // Actions
    async fetchSpace(slug = 'pertencer_lideres') {
      const data = await spaceService.fetch(slug)
      this.space = data
    },
    getUrl(path, fallback) {
      // Concatena caminho da imagem com domínio base da API
      return path ? `${API_BASE}/${path}` : fallback
    },

    //Getters
    getLoginLogoUrl() {
      // Logo do espaço
      return this.getUrl(this.space?.login_logo_url, getPlaceholder(size.login))
    },
    getLoginIconUrl() {
      // Ícone do espaço
      return this.getUrl(this.space?.login_icon_url, getPlaceholder(size.icon))
    },
    getFaviconUrl() {
      // Favicon do espaço
      return this.getUrl(this.space?.favicon_url, getPlaceholder(size.favicon))
    },
    getFooterLogoUrl() {
      // Logo do rodapé do espaço
      return this.getUrl(this.space?.footer_logo_url, getPlaceholder(size.footer))
    },
    getPageTitle() {
      // Título do espaço
      return this.space?.page_title || 'Oops'
    },

    // Styles
    getBackgroundColorStyle() {
      //guard clause (se não houver espaço, retorna cor padrão)
      if (!this.space) {
        return { backgroundColor: this.defaultColor }
      }
      // Estilos de cor do fundo do espaço
      if (this.space?.login_background_color_1 && this.space?.login_background_color_2) {
        return {
          background: `linear-gradient(to bottom, ${this.space.login_background_color_1}, ${this.space.login_background_color_2})`,
        }
      } else if (this.space?.login_background_color_1) {
        return {
          backgroundColor: this.space.login_background_color_1,
        }
      } else {
        return {
          backgroundColor: this.defaultColor,
        }
      }
    },
    getBackgroundImageStyle() {
      // Estilos de imagem de fundo do espaço
      if (this.space?.login_background_image_url) {
        return {
          backgroundImage: `url(${this.getUrl(this.space.login_background_image_url)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
      return {}
    },
  },
})
