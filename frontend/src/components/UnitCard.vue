<template>
  <v-card
    class="rounded-lg px-4"
    :class="{
      'opacity-50': isLocked,
      'highlight-card': isHighlighted,
    }"
    elevation="10"
  >
    <v-card-text class="px-0">
      <div class="d-flex justify-start align-center">
        <h2 class="text-shadow-4 text-h2 font-weight-bold text-info mr-4">0{{ index + 1 }}</h2>
        <p class="text-subtitle-1">{{ unit.title }}</p>
      </div>
    </v-card-text>

    <v-img
      class="rounded elevation-2"
      aspect-ratio="16/9"
      cover
      :src="unit.image"
      :lazy-src="unit.image"
    >
      <template #placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            color="primary"
            indeterminate
          />
        </v-row>
      </template>
    </v-img>

    <div class="py-4">
      <v-progress-linear
        :model-value="unit.progress"
        rounded
        color="info"
        height="10"
        class="inner-shadow-4"
      />
    </div>

    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn
        rounded
        size="small"
        color="primary"
        elevation="0"
        :disabled="isLocked"
        @click="goToUnit"
      >
        Acessar Unidade
      </v-btn>
      <p class="text-caption">{{ unit.completed }} de {{ unit.total }}</p>
    </div>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Propriedades recebidas
const props = defineProps({
  unit: Object,
  index: Number,
  isLocked: Boolean,
  isHighlighted: Boolean,
})

// Inicializa router
const router = useRouter()

const goToUnit = () => {
  router.push({ name: 'Lessons', params: { unitId: props.unit.id } })
}

//const placeholder = 'https://placehold.co/320x180?text=Unidade'
</script>


<style scoped>
.highlight-card {
  border: 4px solid #4fc3f7;
  transform: scale(1.03);
  transition: 0.2s ease-in-out;
  z-index: 10;
}
</style>
