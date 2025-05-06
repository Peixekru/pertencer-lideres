<template>
  <v-card
    transition="scroll-x-transition"
    class="mx-auto px-10 py-6 animate__animated animate__fadeInLeft"
    elevation="4"
    max-width="380"
    rounded="xl"
  >
    <v-img
      class="mx-auto my-8"
      max-width="220"
      src="@/assets/imgs/login-top-logo.svg"
      alt="Logo do topo"
    />

    <div class="text-subtitle-1 text-medium-emphasis">Login</div>

    <v-text-field
      required
      v-model="username"
      :counter="11"
      :class="username.length == 11 ? 'text-success' : ''"
      maxlength="11"
      prepend-inner-icon="mdi-account-outline"
      placeholder="CPF"
      color="secondary"
      aria-label="Campo para inserir CPF"
    />

    <div class="text-subtitle-1 text-medium-emphasis">Senha</div>

    <v-text-field
      required
      v-model="password"
      :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isVisible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      placeholder="- - -"
      color="secondary"
      @click:append-inner="isVisible = !isVisible"
      aria-label="Campo para inserir senha"
    />

    <v-btn
      block
      class="my-3"
      color="primary"
      size="large"
      rounded
      @click="handleLogin"
      aria-label="Botão para entrar"
    >
      Entrar
    </v-btn>

    <v-btn
      block
      rounded
      variant="text"
      append-icon="mdi-chevron-right"
      class="text-center reset-text-transform text-primary mt-6"
      @click="$emit('handlePass', true)"
      aria-label="Botão para recuperar senha"
    >
      Esqueci minha senha
    </v-btn>

    <v-btn
      block
      rounded
      variant="text"
      class="text-center font-weight-bold text-primary mt-2 mb-4"
      @click="$emit('handleMail', true)"
      aria-label="Botão para obter ajuda"
    >
      Precisa de ajuda?
    </v-btn>

    <v-img
      class="mx-auto my-4 animate__animated animate__flipInX animate__delay-1s"
      :class="systemStore.isDarkMode ? 'white-svg' : ''"
      max-width="250"
      src="@/assets/imgs/login-footer-logo.svg"
      alt="Logo do rodapé"
    />
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import { useSystemStore } from '@/store/system'
  //Sons dos botões
  import { useBeepSound } from '@/components/composables/useSounds'
  //Logger
  import logger from '#logger'

  //Inicia a store
  const router = useRouter()
  const authStore = useAuthStore()
  const systemStore = useSystemStore()

  //Exibe / esconde a senha
  const isVisible = ref(false)

  //Armezena user e password
  const password = ref('')
  const username = ref('')

  const handleLogin = async () => {
    logger.stInf('handleLogin:', `username: ${username.value}`, `password: ${password.value}`)

    if (!username.value || username.value.length !== 11 || !password.value) {
      systemStore.globalMsg('Oops! Seu login precisa ter 11 caracteres', 'error')
      // HIGHLIGHT: next line - mensagem de erro
      //  alert('Oops! Seu login precisa ter 11 caracteres') // Exibe o alerta
      return
    }

    try {
      // store / outh . login  -->  response { user:{ id , login } token: token }
      await authStore.login(username.value, password.value)
      // HIGHLIGHT: next line - mensagem de sucesso
      // alert('Login realizado com sucesso!')
      router.push('/home')
    } catch (error) {
      alert(error.message || 'Erro ao fazer login.')
    }
  }

  onMounted(() => {
    useBeepSound()
  })
</script>
