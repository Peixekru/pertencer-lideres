<template>
  <v-card
    transition="scroll-x-transition"
    class="mx-auto px-10 py-6 animate__animated animate__fadeInRight"
    elevation="4"
    max-width="380"
    rounded="xl"
  >
    <v-img
      class="mx-auto my-8"
      max-width="220"
      src="@/assets/imgs/login-top-logo.svg"
    />

    <div class="text-subtitle-1 text-medium-emphasis mb-3">
      Insira seu CPF para receber uma nova senha por e-mail.
    </div>

    <v-text-field
      v-model="userCPF"
      :counter="11"
      :class="userCPF.length == 11 ? 'text-success' : ''"
      maxlength="11"
      prepend-inner-icon="mdi-account-outline"
      placeholder="CPF"
      required
      color="secondary"
    />

    <v-btn
      block
      class="my-3"
      color="primary"
      size="large"
      rounded
      @click="
        userCPF != '' && userCPF.length == 11
          ? resetPwd()
          : systemStore.globalMsg('Oops! Seu login precisa ter 11 caracteres', 'error')
      "
    >
      Enviar
    </v-btn>

    <v-btn
      block
      rounded
      variant="text"
      prepend-icon="mdi-chevron-left"
      class="text-center reset-text-transform text-primary mt-6"
      @click="$emit('handlePass', false)"
    >
      Entrar com minha senha
    </v-btn>

    <v-btn
      block
      rounded
      variant="text"
      class="text-center font-weight-bold text-primary mt-2 mb-4"
      @click="$emit('handleMail', false)"
    >
      Precisa de ajuda?
    </v-btn>

    <v-img
      class="mx-auto my-4 animate__animated animate__flipInX animate__delay-1s"
      :class="systemStore.isDarkMode ? 'white-svg' : ''"
      max-width="250"
      src="@/assets/imgs/login-footer-logo.svg"
    />
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useSystemStore } from '@/store/system'
  import { useAuthStore } from '@/store/userAuth'

  //Sons dos botões
  import { useBeepSound } from '@/components/composables/useSounds'

  //Inicia a store
  const systemStore = useSystemStore()
  const authStore = useAuthStore()

  const userCPF = ref('')

  //Limpa informações do usuário persistentes
  localStorage.removeItem('userInfos')

  //Envia cpf quando o usuário esquece a senha
  const resetPwd = () => {
    authStore.useLogin(
      // path / { user, password }
      '/resetpassword',
      { userCPF: userCPF.value },
    )
  }

  onMounted(() => {
    useBeepSound()
  })
</script>
