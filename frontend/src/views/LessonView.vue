<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
      >
        <!-- Botão de voltar -->
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          @click="goBack"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Voltar
        </v-btn>

        <!-- Título da lição -->
        <h2 class="text-h5 mb-4">
          {{ currentLesson?.title || 'Lição não encontrada' }} (ID: {{ lessonId }})
          <v-icon
            v-if="isCompleted || completed"
            color="success"
            class="ml-2"
          >
            mdi-check-circle
          </v-icon>
        </h2>

        <!-- Conteúdo simulado -->
        <v-sheet
          elevation="1"
          rounded
          class="pa-4 text-center"
        >
          <p>Conteúdo da lição (iframe bloqueado por CORS)</p>
        </v-sheet>

        <!-- Botão de concluir -->
        <v-btn
          color="primary"
          class="mt-6"
          :disabled="isCompleted || completed"
          @click="markAsCompleted"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isCompleted || completed ? 'Concluído' : 'Concluir Lição' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCourseStore } from '@/store/course'
import { useProgressStore } from '@/store/progress'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const courseStore = useCourseStore()
const progressStore = useProgressStore()

const userId = authStore.user?.id
const courseId = courseStore.currentCourse?.id
const lessonId = Number(route.params.lessonId)

const completed = ref(false)

// Busca a lição correta no progresso
const progressUnit = computed(() => {
  return progressStore.progressData?.units?.find((unit) =>
    unit.lessons?.some((l) => l.id === lessonId)
  )
})

const currentLesson = computed(() => progressUnit.value?.lessons?.find((l) => l.id === lessonId))

const isCompleted = computed(() => currentLesson.value?.is_completed === 1)

onMounted(() => {
  completed.value = isCompleted.value
})

const goBack = () => {
  router.back()
}

const markAsCompleted = async () => {
  console.log('ID da lição:', lessonId)

  try {
    await fetch(`http://localhost:3000/api/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })

    const progressRes = await fetch(
      `http://localhost:3000/api/users/${userId}/courses/${courseId}/progress`
    )
    if (!progressRes.ok)
      throw new Error(`Erro ao buscar progresso atualizado: ${progressRes.statusText}`)
    const progressDataFromApi = await progressRes.json()

    Object.assign(progressStore.progressData, progressDataFromApi)

    completed.value = true
    console.log('Progresso atualizado na store:', progressDataFromApi)
  } catch (error) {
    console.error('Erro ao concluir ou atualizar a lição:', error)
  }
}
</script>
