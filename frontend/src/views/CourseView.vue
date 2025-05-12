<template>
  <v-container
    fluid
    class="fill-height pa-0 d-flex flex-column"
  >
    <!-- descrição -->
    <v-container
      fluid
      class="pt-16"
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
            :src="headerImageUrl"
            :class="settingsStore.isDark && 'svg-filter--white'"
            max-height="100"
            width="300"
            contain
          />

          <!-- Título -->
          <h5 class="text-h5 text-primary text-uppercase text-disabled mt-4">{{ courseTitle }}</h5>
          <p class="text-primary">{{ courseSubtitle }}</p>
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
            :is-locked="unit.isLocked"
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
        :src="footerLogoUrl"
        :class="settingsStore.isDark && 'svg-filter--white'"
        max-height="64"
        contain
        alt="Logo do rodapé"
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
        color="rgba(0,0,0,.1)"
        class="inner-shadow-4"
        :class="{ 'mb-2': i < badges.length - 1 }"
      >
        <v-icon color="white">{{ badge.icon }}</v-icon>
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// Pinia
import { storeToRefs } from 'pinia'
// Stores
import { useSpaceStore } from '@/store/space'
import { useSettingsStore } from '@/store/settings'
import { useCourseStore } from '@/store/course'
import { useUnitStore } from '@/store/unit'
import { useProgressStore } from '@/store/progress'
import { mapUnitsWithLockState } from '@/domain/progress/mapUnitsWithLockState'

// Componentes
import UnitCard from '@/components/UnitCard.vue'
// Sons dos botões
import { useBeepSound } from '@/utils/sounds'
//Logger
import logger from '#logger'

// inicialização dos stores
const spaceStore = useSpaceStore()
const settingsStore = useSettingsStore()
const courseStore = useCourseStore()
const unitStore = useUnitStore()
const progressStore = useProgressStore()

// Sons dos botões
useBeepSound()

// importação da imagem do branding via store getter
const { headerImageUrl } = storeToRefs(settingsStore)
const footerLogoUrl = spaceStore.getFooterLogoUrl()

// Variáveis reativas
const courseTitle = ref('')
const courseSubtitle = ref('')

//
const unidades = computed(() =>
  mapUnitsWithLockState(progressStore.unitsWithProgress, unitStore.getUnitById)
)

// inicialização
onMounted(async () => {
  // Carrega os dados do curso e das unidades
  await Promise.all([courseStore.fetchUserCourse(), unitStore.fetchUnits()])
  // Carrega id do curso atual
  const courseId = courseStore.currentCourse?.id
  // Carrega o progresso do curso atual
  courseId && (await progressStore.fetchCourseProgress(courseId))
  // Atualiza o título do curso
  courseTitle.value = courseStore.currentCourse?.title
  // Atualiza o subtítulo do curso
  courseSubtitle.value = courseStore.currentCourse?.subtitle

  logger.stInf('Retorno de unidades', unidades.value)
})

// mock de badges
const badges = ref([
  { icon: 'mdi-account' },
  { icon: 'mdi-information' },
  { icon: 'mdi-lock' },
  { icon: 'mdi-water-percent' },
])
</script>

<style scoped>
.floating-menu {
  position: fixed;
  right: 16px;
  top: 30%;
  z-index: 1000;
}
</style>