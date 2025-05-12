<template>
  <v-container>
    <!-- Navegação -->
    <router-link
      class="mx-auto mt-6 d-block"
      to="/course"
    >
      ← Voltar ao curso
    </router-link>

    <!-- Título -->
    <h2 class="mt-6 mb-4">Escolha uma lição da Unidade {{ unitId }}</h2>

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

    <!-- Lista de lições -->
    <v-list v-if="lessons.length">
      <v-list-item
        v-for="lesson in lessons"
        :key="lesson.id"
        :to="{ name: 'Lesson', params: { lessonId: lesson.id } }"
        link
      >
        <v-list-item-title>
          {{ lesson.title }} (ID: {{ lesson.id }})
          <v-icon
            v-if="lesson.is_completed"
            color="success"
            class="ml-2"
          >
            mdi-check-circle
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProgressStore } from '@/store/progress'

const route = useRoute()
const unitId = Number(route.params.unitId)

const progressStore = useProgressStore()
const loading = ref(true)

const progressUnit = computed(() => progressStore.getUnitProgressById(unitId))

const lessons = computed(() => progressUnit.value?.lessons || [])

onMounted(() => {
  loading.value = false
})
</script>
