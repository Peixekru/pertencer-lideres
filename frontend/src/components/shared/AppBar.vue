<template>
  <!-- Header fixo -->
  <v-app-bar
    app
    :elevation="showBackground ? 2 : 0"
    :color="
      showBackground
        ? settingsStore.isDark
          ? 'rgba(20,20,20,0.8)'
          : 'rgba(255,255,255,0.7)'
        : 'transparent'
    "
    :class="showBackground && 'blur-10'"
  >
    <v-container
      fluid
      class="position-relative w-100"
    >
      <!-- Barra de progresso  -->
      <v-progress-linear
        :model-value="progress"
        height="8"
        color="primary"
        class="w-100 position-fixed top-0 left-0 z-index-1"
      />

      <!-- Conteúdo da app-bar -->
      <v-row
        align="center"
        justify="space-between"
        class="w-100 pb-2 pt-4 mx-auto"
      >
        <!-- Logo -->
        <!-- Logo ou botão voltar -->
        <div>
          <template v-if="isCourseView">
            <div
              style="width: 120px"
              :class="settingsStore.isDark && 'svg-filter--white'"
              :style="!showBackground && 'opacity: 0'"
            >
              <v-img
                :src="headerLogoUrl"
                max-height="40"
                width="120"
                contain
              />
            </div>
          </template>
          <template v-else>
            <v-btn
              icon
              @click="goBack"
              color="primary"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
        </div>

        <!-- Botões centrais -->
        <v-sheet
          color="transparent"
          class="d-flex justify-end flex-grow-1 me-1"
        >
          <v-btn
            icon
            class="mx-1 pa-0"
            color="primary"
            style="width: 40px; height: 40px"
          >
            <v-avatar
              size="40"
              :class="settingsStore.isDark && 'svg-filter--white'"
            >
              <v-img :src="headerIcons.access" />
            </v-avatar>
          </v-btn>
          <v-btn
            icon
            class="mx-1 pa-0"
            color="primary"
            style="width: 40px; height: 40px"
          >
            <v-avatar
              size="40"
              :class="settingsStore.isDark && 'svg-filter--white'"
            >
              <v-img :src="headerIcons.info" />
            </v-avatar>
          </v-btn>
          <v-btn
            icon
            class="mx-1 pa-0"
            color="primary"
            style="width: 40px; height: 40px"
            @click="handleLogout"
          >
            <v-avatar
              size="40"
              :class="settingsStore.isDark && 'svg-filter--white'"
            >
              <v-img :src="headerIcons.exit" />
            </v-avatar>
          </v-btn>
        </v-sheet>

        <!-- Botão à direita -->
        <div>
          <v-btn
            rounded
            size="small"
            variant="elevated"
            color="primary"
            elevation="0"
          >
            Rever Introdução
          </v-btn>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { useBeepSound } from '@/utils/sounds'
import logger from '#logger'

// Inicializa os stores e efeitos sonoros
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

// Acesso à rota atual
const route = useRoute()
const router = useRouter()

// Imagem e ícones do cabeçalho
const { headerLogoUrl, headerIcons } = storeToRefs(settingsStore)

// Estado de fundo da app-bar
const showBackground = ref(false)

// Detecta se está na rota de curso (única que depende de scroll)
const isCourseView = computed(() => route.path.startsWith('/course'))

// Atualiza visibilidade do fundo da app-bar com base na rota e scroll
const handleScroll = () => {
  showBackground.value = !isCourseView.value || window.scrollY > 60
}

// Função para voltar à página anterior
const goBack = () => router.back()

// Sai da conta
const handleLogout = () => {
  authStore.logout()
}

// Props da app-bar
defineProps({
  progress: {
    type: Number,
    required: true,
  },
})

// Inicializa e limpa o listener de scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  useBeepSound()
})

// Limpa o listener de scroll ao desmontar o componente
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Reavalia o estado da AppBar sempre que o caminho da rota mudar
watch(
  () => route.path,
  () => {
    handleScroll()
  }
)
</script>