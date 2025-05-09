<template>
  <v-container>
    <!--Navegação provisória-->
    <router-link
      class="mx-auto mt-6"
      to="/units"
    >
      back to units
    </router-link>

    <h1>Lições</h1>
    <v-progress-circular
      v-if="lessonStore.loading"
      indeterminate
      color="primary"
    />
    <v-alert
      v-if="lessonStore.error"
      type="error"
    >
      {{ lessonStore.error }}
    </v-alert>
    <v-list v-if="lessonStore.lessons.length">
      <v-list-item
        v-for="lesson in lessonStore.lessons"
        :key="lesson.id"
      >
        <v-list-item-title>{{ lesson.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLessonStore } from '@/store/lesson'
import { useRoute } from 'vue-router'

const lessonStore = useLessonStore()
const route = useRoute()

onMounted(async () => {
  const unitId = route.params.unitId
  if (unitId) {
    await lessonStore.fetchLessons(unitId)
  }
})
</script>