<template>
  <v-container
    class="pa-0"
    elevation="1"
  >
    <v-divider class="my-8 border-opacity-25" />

    <!-- Pergunta -->
    <div class="px-6 pt-4">
      <h6 class="text-h6 text-left text-primary font-weight-bold mb-8">{{ question.text }}</h6>
      <v-textarea
        v-model="text"
        rows="7"
        rounded="lg"
        variant="outlined"
        style="height: 214px"
        @input="emitAnswer"
      />
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

const text = ref(props.answer || '')

watch(
  () => props.answer,
  (newVal) => {
    text.value = newVal
  }
)

const emitAnswer = () => {
  emit('update', text.value)
}
</script>
