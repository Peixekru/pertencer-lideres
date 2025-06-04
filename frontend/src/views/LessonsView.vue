<template>
  <v-container
    class="mt-10"
    style="max-width: 1280px; margin: 0 auto"
  >
    <!-- Título -->
    <h5 class="text-h4-20 text-primary mt-6 mb-6">
      Conteúdos dessa unidade:
      <!--<span class="text-overline ms-2">id: {{ unitId }}</span>-->
    </h5>

    <!-- Loading -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    />

    <!-- Sem lições -->
    <v-alert
      v-if="!lessons.length && !loading"
      type="warning"
    >
      Nenhuma lição encontrada para esta unidade.
    </v-alert>

    <!-- Grid de lições -->
    <v-row
      v-if="lessons.length"
      dense
    >
      <v-col
        v-for="(lesson, i) in lessons"
        :key="lesson.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex py-6 px-3"
      >
        <LessonCard
          :lesson="lesson"
          :index="i"
          :highlight="!lesson.isLocked && !lesson.completed"
          class="w-100"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/**
 * UnitView.vue
 *
 * Página que exibe as lições de uma unidade específica.
 * Responsável por:
 * - Mostrar título e ID da unidade
 * - Listar as lições com base no progresso do aluno
 * - Aplicar regras de bloqueio/desbloqueio
 */

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProgressStore } from '@/store/progress'
import { mapLessonsWithLockState } from '@/domain/lesson/mapLessonsWithLockState'
import LessonCard from '@/components/LessonCard.vue'

const route = useRoute()
const unitId = Number(route.params.unitId)

const progressStore = useProgressStore()
const loading = ref(true)

/**
 * Progresso da unidade atual, incluindo suas lições com status de conclusão.
 */
const progressUnit = computed(() => progressStore.getUnitProgressById(unitId))

/**
 * Lista computada de lições com base no progresso da unidade.
 *
 * - Usa a função de domínio `mapLessonsWithLockState`
 * - Ordena e bloqueia lições conforme regras de dependência (ex: lição anterior concluída)
 * - Enriquecida com campos: `completed`, `isLocked`, `rating`
 *
 * @type {import('@/domain/lesson/mapLessonsWithLockState').MappedLesson[]}
 */
const lessons = computed(() => mapLessonsWithLockState(progressUnit.value?.lessons || []))

onMounted(() => {
  loading.value = false
})
</script>
