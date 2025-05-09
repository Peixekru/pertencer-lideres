<template>
  <v-container
    fluid
    class="fill-height pa-0 d-flex flex-column"
  >
    <!-- Header fixo -->
    <v-app-bar
      app
      :elevation="showBackground ? 2 : 0"
      :color="showBackground ? 'rgba(255,255,255,0.7)' : 'transparent'"
      :class="showBackground ? 'blur-10' : ''"
    >
      <!-- Barra de progresso no topo -->
      <v-container
        fluid
        class="position-relative w-100"
      >
        <!-- Barra de progresso absoluta dentro do espaço reservado -->
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
          <div style="width: 120px">
            <v-img
              src="https://placehold.co/120x40?text=Logo"
              max-height="40"
              width="120"
              contain
            />
          </div>

          <!-- Botões centrais -->
          <div class="d-flex justify-center flex-grow-1">
            <v-btn
              icon
              color="primary"
              class="mx-1"
            >
              <v-icon>mdi-book</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              icon
              class="mx-1"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              class="mx-1"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>

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

    <!-- Sentinela logo após a app-bar -->
    <div
      ref="sentinela"
      style="height: 1px"
    />

    <!-- descrição -->
    <v-container
      fluid
      class="pt-16 mt-16"
    >
      <v-row
        justify="start"
        style="max-width: 1200px; margin: 0 auto"
      >
        <v-sheet
          color="transparent"
          class="mx-2"
        >
          <!-- Logo -->

          <v-img
            src="https://placehold.co/300x100?text=Logo"
            max-height="100"
            width="300"
            contain
          />

          <!-- Título -->
          <h5 class="text-h5 text-uppercase text-disabled mt-4">
            Programa de integração dos novos líderes.
          </h5>
        </v-sheet>
      </v-row>
    </v-container>

    <!-- Cards das unidades -->
    <v-container
      fluid
      class="py-8"
    >
      <v-row
        justify="center"
        style="max-width: 1200px; margin: 0 auto"
      >
        <v-col
          v-for="(unit, index) in unidades"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          class="py-6"
        >
          <UnitCard
            :unit="unit"
            :index="index"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Cards especiais (mock) -->
    <v-container class="mb-12 mt-8 text-center">
      <v-row justify="center">
        <v-col
          v-for="(item, i) in 3"
          :key="i"
          cols="12"
          sm="4"
        >
          <v-card
            class="py-6"
            elevation="0"
          >
            <p class="text-subtitle-1 mt-2">Funcionalidade {{ i + 1 }}</p>
            <v-icon size="48">mdi-lock</v-icon>
            <v-sheet>
              <v-btn
                class="mt-2"
                variant="text"
              >
                Acessar
              </v-btn>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer com logo -->
    <v-container class="text-center mt-auto mb-4">
      <v-img
        src="https://placehold.co/120x40?text=Logo_Footer"
        max-height="40"
        contain
      />
    </v-container>

    <!-- Menu flutuante lateral (desktop) -->
    <v-sheet
      color="rgba(100,100,100,.2)"
      rounded="pill"
      style="padding: 4px"
      class="floating-menu d-none d-md-flex flex-column align-center"
    >
      <v-btn
        v-for="(badge, i) in badges"
        :key="i"
        icon
        color="rgba(0,0,0,.2)"
        style="box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.4)"
        :class="{ 'mb-2': i < badges.length - 1 }"
      >
        <v-icon color="white">{{ badge.icon }}</v-icon>
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import UnitCard from '@/components/UnitCard.vue'

const unidades = ref([
  { title: 'Unidade 1', progress: 10, total: 10 },
  { title: 'Unidade 2', progress: 30, total: 10 },
  { title: 'Unidade 3', progress: 0, total: 10 },
  { title: 'Unidade 4', progress: 0, total: 10 },
  { title: 'Unidade 1', progress: 100, total: 10 },
  { title: 'Unidade 2', progress: 30, total: 10 },
  { title: 'Unidade 3', progress: 0, total: 10 },
  { title: 'Unidade 4', progress: 0, total: 10 },
])

const progress = ref(16)

const badges = ref([
  { icon: 'mdi-account' },
  { icon: 'mdi-information' },
  { icon: 'mdi-lock' },
  { icon: 'mdi-water-percent' },
])

const showBackground = ref(false)

const handleScroll = () => {
  showBackground.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.floating-menu {
  position: fixed;
  right: 16px;
  top: 30%;
  z-index: 1000;
}
</style>


<!--<template>
  <v-container>
    <router-link
      class="mx-auto mt-6"
      to="/units"
    >
      go to Units
    </router-link>
    <h1>Curso</h1>

    <v-btn @click="authStore.logout">logout</v-btn>

    <SwithTheme />

    <div v-if="courseStore.loading">Carregando...</div>
    <div v-else-if="courseStore.error">Erro: {{ courseStore.error }}</div>
    <div v-else>
      <pre>{{ courseStore.currentCourse }}</pre>
    </div>
  </v-container>
</template>-->

<!--<script setup>
import { onMounted } from 'vue'
import { useCourseStore } from '@/store/course'
import SwithTheme from '../components/SwithTheme.vue'
import { useAuthStore } from '../store/auth'

//Sons dos botões
import { useBeepSound } from '@/utils/sounds'

const authStore = useAuthStore()
const courseStore = useCourseStore()

onMounted(() => {
  courseStore.fetchUserCourse()
  useBeepSound()
})
</script>-->