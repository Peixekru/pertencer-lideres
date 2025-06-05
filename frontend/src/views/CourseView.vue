<template>
  <v-container
    fluid
    class="fill-height pa-0 d-flex flex-column"
    style="max-width: 1280px; margin: 0 auto"
  >
    <!-- descrição -->
    <v-container
      fluid
      class="pt-16"
    >
      <v-row
        justify="start"
        style="margin: 0 auto"
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
      <v-row justify="center">
        <v-col
          v-for="(unit, index) in unidades"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="3"
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
          v-for="(item, i) in 2"
          :key="i"
          cols="12"
          sm="4"
        >
          <v-card
            class="py-6"
            elevation="0"
            rounded="lg"
            style="opacity: 0.5"
          >
            <p class="text-subtitle-1 text-primary my-2">{{ features[i] }}</p>
            <v-icon
              size="48"
              color="primary"
            >
              mdi-progress-clock
            </v-icon>
            <v-sheet>
              <!--Voltar com : disabled-->
              <v-btn
                rounded
                class="mt-2"
                variant="text"
                @click="showComingSoon"
              >
                Acessar
              </v-btn>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer com logo -->
    <!-- Separar a logo do footer: Uma par login e outra para o curso -->
    <!--  :class="settingsStore.isDark && 'svg-filter--white'" -->
    <v-container class="text-center mt-auto mb-4">
      <v-img
        :src="footerLogoUrl"
        class="svg-filter--white"
        max-height="64"
        contain
        alt="Logo do rodapé"
      />
    </v-container>

    <!-- Menu flutuante lateral (desktop) -->
    <v-sheet
      color="primary"
      rounded="lg"
      class="floating-menu d-none d-md-flex flex-column align-center px-1 py-2"
    >
      <!-- Ícones dos badges -->
      <v-btn
        v-for="(badge, i) in lessonBadges"
        :key="badge.lessonId"
        icon
        color="rgba(255,255,255,.4)"
        class="inner-shadow-4"
        :class="{ 'mb-2': i < badges.length - 1 }"
      >
        <v-icon size="32">
          <v-img :src="badge.icon" />
        </v-icon>
      </v-btn>
      <!-- Ícone do progresso -->
      <v-btn
        icon
        color="transparent"
        elevation="0"
        class="mt-2"
      >
        <v-icon size="32">mdi-progress-clock</v-icon>
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
import { useLessonStore } from '@/store/lesson'
import { useProgressStore } from '@/store/progress'
import { mapUnitsWithLockState } from '@/domain/progress/mapUnitsWithLockState'
import { useModalStore } from '@/store/modal'

// Componentes
import UnitCard from '@/components/UnitCard.vue'
// Completa a URL da API
import { getUrl } from '@/utils/url'
// Modal
import ComingSoon from '@/components/devTools/ComingSoonModal.vue'
// Sons dos botões
import { useBeepSound } from '@/utils/sounds'
//Logger
import logger from '#logger'

// inicialização dos stores
const spaceStore = useSpaceStore()
const settingsStore = useSettingsStore()
const courseStore = useCourseStore()
const unitStore = useUnitStore()
const lessonStore = useLessonStore()
const progressStore = useProgressStore()
const modal = useModalStore()

// importação da imagem do branding via store getter
const { headerImageUrl } = storeToRefs(settingsStore)
const footerLogoUrl = spaceStore.getFooterLogoUrl()

// Variáveis reativas
const courseTitle = ref('')
const courseSubtitle = ref('')

// Busca os badges das lições
const lessonBadges = computed(() => {
  return lessonStore.lessons
    .filter((lesson) => lesson.badge)
    .sort((a, b) => a.order_index - b.order_index)
    .map((lesson) => ({
      icon: getUrl(lesson.badge),
      lessonId: lesson.id,
    }))
})

// Mostra o modal de "em breve"
function showComingSoon() {
  modal.openModal(ComingSoon, { title: 'Funcionalidade em breve' }, { maxWidth: 800 })
}

/**
 * Lista computada de unidades do curso com base no progresso do aluno.
 *
 * - Aplica regras de desbloqueio progressivo.
 * - Enriquecida com imagem, progresso e estado de bloqueio.
 *
 * @type {import('@/utils/mapUnitsWithLockState').MappedUnit[]}
 */
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

  /**
   * Pré-carrega todas as lições das unidades desbloqueadas.
   * Garante que as lições venham tratadas pelo middleware (ex: patch SCORM).
   * * @todo Mover para camada de orquestração se lógica crescer.
   */
  await lessonStore.preloadLessonsForUnits(unidades.value)

  // Sons dos botões
  useBeepSound()

  logger.stInf('Lista de unidades', unidades.value)
})

// mock de badges
const badges = ref([
  { icon: 'mdi-account' },
  { icon: 'mdi-information' },
  { icon: 'mdi-lock' },
  { icon: 'mdi-water-percent' },
])
// Títilo das features em desenvolvimento
const features = ref(['Dashboard', 'Tira-dúvidas'])
</script>

<style scoped>
.floating-menu {
  position: fixed;
  right: 16px;
  top: 30%;
  z-index: 1000;
}
</style>