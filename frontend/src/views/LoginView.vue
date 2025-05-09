<template>
  <v-container
    fluid
    class="fill-height position-relative"
    :style="spaceStore.getBackgroundColorStyle()"
  >
    <v-container
      fluid
      class="pa-0 bg-img"
      :style="spaceStore.getBackgroundImageStyle()"
    />

    <v-responsive class="align-center fill-height">
      <component
        :is="currentComponent"
        @handlePass="handlePass"
        @handleMail="handleMail"
      />
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpaceStore } from '@/store/space'
import { setFavicon } from '@/utils/setFavicon'

import Login from '@/components/login/Login.vue'
import ForgotLogin from '@/components/login/ForgotLogin.vue'

const spaceStore = useSpaceStore()
const isForgotPass = ref(false)

// Definição dinâmica do componente ativo
const currentComponent = computed(() => (isForgotPass.value ? ForgotLogin : Login))

// Alterna entre tela de login e recuperação de senha
const handlePass = (arg) => (isForgotPass.value = arg)

const handleMail = () => {
  const subject = encodeURIComponent('Contato - Pertencer')
  const body = encodeURIComponent('Olá, Einstein Pertencer!')
  const email = 'ensinocorporativo@einstein.br'

  window.open(`mailto:${email}?subject=${subject}&body=${body}`)
}

onMounted(async () => {
  await spaceStore.fetchSpace('pertencer_lideres')
  setFavicon(spaceStore.getFaviconUrl())
  document.title = spaceStore.getPageTitle()
})
</script>

<style lang="scss" scoped>
.bg-img {
  inset: 0;
  z-index: 0;
  position: absolute;
  background-repeat: no-repeat;
}
</style>
