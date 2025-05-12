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

        <!-- Botões centrais -->
        <v-sheet
          color="transparent"
          class="d-flex justify-center flex-grow-1"
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/store/settings'
// Sons dos botões
import { useBeepSound } from '@/utils/sounds'
//Logger
import logger from '#logger'

// inicialização dos stores
const settingsStore = useSettingsStore()
useBeepSound()

// Imagem do cabeçalho
const { headerLogoUrl } = storeToRefs(settingsStore)

// Icones da do app-bar
const { headerIcons } = storeToRefs(settingsStore)

// Variáveis reativas
const showBackground = ref(false)

// Função para lidar com o evento de rolagem
const handleScroll = () => {
  showBackground.value = window.scrollY > 60
}

// Propriedades exportadas
defineProps({
  // Progresso do curso
  progress: {
    type: Number,
    required: true,
  },
})

// inicialização
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
</style>