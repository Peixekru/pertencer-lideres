<template>
  <!-- Navegação provisória -->
  <router-link
    class="mx-auto mt-6"
    to="/home"
  >
    Go to Home
  </router-link>

  <v-container
    fluid
    class="fill-height"
    :class="systemStore.isDarkMode ? 'login-gradiente-dark' : 'login-gradiente-light'"
  >
    <v-container
      fluid
      class="pa-0 bg-img-graf"
      :class="systemStore.isDarkMode ? 'bg-img-graf-opacity-dark' : ''"
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
  import { useTheme } from 'vuetify'
  import { useSystemStore } from '../store/system'
  import Login from '@/components/login/Login.vue'
  import ForgotLogin from '@/components/login/ForgotLogin.vue'

  const theme = useTheme()
  const systemStore = useSystemStore()
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

  onMounted(() => {
    theme.global.name.value = systemStore.isDarkMode ? 'dark' : 'light'
  })
</script>

<style lang="scss" scoped>
  .bg-img-graf-opacity-dark {
    opacity: 0.3 !important;
  }
</style>
