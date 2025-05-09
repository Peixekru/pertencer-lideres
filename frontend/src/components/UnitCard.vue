<template>
  <v-card
    class="rounded-lg px-4"
    :class="{
      'opacity-50': unit.status === 0,
      'highlight-card': isHighlighted,
    }"
    elevation="10"
  >
    <v-card-text class="px-0">
      <div class="d-flex justify-start align-center">
        <h2 class="text-h2 font-weight-bold text-info mr-4">0{{ index + 1 }}</h2>
        <p class="text-subtitle-1">{{ unit.title }}</p>
      </div>
    </v-card-text>

    <v-img
      class="rounded elevation-2"
      :class="unit.status === 0 ? 'grayscale-filter' : ''"
      aspect-ratio="16/9"
      cover
      :src="unit.image || placeholder"
      :lazy-src="placeholder"
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
        color="info"
        height="10"
        rounded
      />
    </div>

    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn
        rounded
        size="small"
        color="primary"
        elevation="0"
        :disabled="unit.status === 0"
        @click="$emit('select', unit)"
      >
        Acessar Unidade
      </v-btn>
      <p class="text-caption">{{ unit.progress }} de {{ unit.total }}</p>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  unit: Object,
  index: Number,
  isHighlighted: Boolean,
})

const placeholder = 'https://placehold.co/320x180?text=Unidade'
</script>

<style scoped>
.grayscale-filter {
  filter: grayscale(1);
}

.highlight-card {
  border: 4px solid #4fc3f7;
  transform: scale(1.03);
  transition: 0.2s ease-in-out;
  z-index: 10;
}
</style>
