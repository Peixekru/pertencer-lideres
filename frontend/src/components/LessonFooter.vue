<template>
  <v-bottom-navigation
    v-show="isCompleted"
    height="100"
    class="bg-info footer-shadow"
  >
    <v-container
      fluid
      class="d-flex align-center justify-space-between ps-0"
    >
      <!-- Avaliação -->
      <v-sheet
        elevation="2"
        class="px-4 py-2 d-flex align-center right-radios"
      >
        <v-rating
          :model-value="rating"
          @update:modelValue="$emit('rating', $event)"
          length="5"
        >
          <template #item="{ isFilled }">
            <IconStarFilled
              :fill="isFilled ? primary : info"
              :size="28"
            />
          </template>
        </v-rating>
      </v-sheet>

      <!-- Próxima lição + botão -->
      <div class="d-flex align-center">
        <div class="text-end me-6">
          <div class="text-caption text-accent">Próximo conteúdo:</div>
          <div class="text-h5 font-weight-regular text-accent">
            {{ nextTitle }}
          </div>
        </div>

        <v-btn
          class="bg-primary"
          size="small"
          rounded="xl"
          height="32"
          :active="false"
          @click="$emit('next')"
        >
          {{ isUnitFinished && goToCourseAfterUnit ? 'Finalizar' : 'Prosseguir' }}
        </v-btn>
      </div>
    </v-container>
  </v-bottom-navigation>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import IconStarFilled from '@/components/icons/IconStarFilled.vue'

// Props
const props = defineProps({
  goToCourseAfterUnit: Boolean,
  isCompleted: Boolean,
  isUnitFinished: Boolean,
  rating: Number,
  nextTitle: String,
})

const emit = defineEmits(['next', 'rating'])

//console.log('isCompleted prop:', props.isCompleted)

// Tema
const { current } = useTheme()
const primary = computed(() => current.value.colors.primary)
const info = computed(() => current.value.colors.info)
</script>

<style lang="scss" scoped>
.footer-shadow {
  box-shadow: rgba(0, 0, 0, 0.4) 0 -4px 8px;
}
.right-radios {
  border-radius: 0 24px 24px 0;
}
</style>
