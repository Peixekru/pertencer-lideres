<template>
  <v-container>
    <!--Navegação provisória-->
    <router-link
      class="mx-auto mt-6"
      to="/course"
    >
      back to course
    </router-link>

    <h1>Unidades</h1>
    <v-progress-circular
      v-if="unitStore.loading"
      indeterminate
      color="primary"
    />
    <v-alert
      v-if="unitStore.error"
      type="error"
    >
      {{ unitStore.error }}
    </v-alert>
    <v-list v-if="unitStore.units.length">
      <v-list-item
        v-for="unit in unitStore.units"
        :key="unit.id"
        :to="{ name: 'Lessons', params: { unitId: unit.id } }"
        link
      >
        <v-list-item-title>{{ unit.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUnitStore } from '@/store/unit'

const unitStore = useUnitStore()

onMounted(async () => {
  await unitStore.fetchUnits()
})
</script>