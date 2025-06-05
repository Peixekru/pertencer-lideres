/**
 * Store responsável pelo controle de modais globais da aplicação.
 *
 * Funcionalidades:
 * - Armazenar o componente dinâmico que será exibido no modal.
 * - Definir propriedades e opções customizadas para o modal.
 * - Permitir abrir e fechar o modal de qualquer lugar da aplicação.
 *
 * Observações:
 * - Compatível com o componente <GlobalModal />.
 * - Ideal para exibir componentes reutilizáveis como alertas, formulários, ou conteúdos dinâmicos.
 * - Usa `markRaw` para evitar que Vue torne o componente reativo, o que causaria warnings e perda de performance.
 */

import { ref, markRaw } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  // Estado reativo do modal
  const isOpen = ref(false) // indica se o modal está visível
  const component = ref(null) // componente a ser renderizado dentro do modal
  const props = ref({}) // props que serão passadas para o componente
  const options = ref({}) // opções adicionais como tamanho (ex: maxWidth)

  /**
   * Abre o modal com um componente dinâmico.
   * @param {import('vue').Component} modalComponent - Componente Vue a ser exibido no modal
   * @param {Object} modalProps - Propriedades a serem passadas para o componente
   * @param {Object} modalOptions - Opções como `maxWidth`, `persistent`, etc.
   */
  function openModal(modalComponent, modalProps = {}, modalOptions = {}) {
    component.value = markRaw(modalComponent) // evita que o componente seja tornado reativo
    props.value = modalProps
    options.value = modalOptions
    isOpen.value = true
  }

  /**
   * Fecha o modal e limpa o estado.
   */
  function closeModal() {
    isOpen.value = false
    component.value = null
    props.value = {}
    options.value = {}
  }

  return {
    isOpen,
    component,
    props,
    options,
    openModal,
    closeModal,
  }
})
