<template>
  <v-container
    class="pa-0"
    elevation="1"
  >
    <v-divider class="my-8 border-opacity-25" />

    <!-- Pergunta -->
    <div class="px-6 pt-4">
      <h6 class="text-h6 text-left text-primary font-weight-bold mb-8">{{ question.text }}</h6>
      <v-radio-group
        v-model="selected"
        color="primary"
        @change="emitAnswer"
        class="d-flex flex-column text-left"
      >
        <v-radio
          v-for="option in question.options"
          :key="option"
          :label="option"
          :value="option"
          class="mb-2"
        />
      </v-radio-group>
    </div>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  question: Object,
  answer: String,
})

const emit = defineEmits(['update'])

const selected = ref(props.answer || '')

watch(
  () => props.answer,
  (newVal) => {
    selected.value = newVal
  }
)

const emitAnswer = () => {
  emit('update', selected.value)
}
</script>
