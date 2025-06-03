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
      <!-- Avaliação (Rating) -->
      <v-sheet
        elevation="2"
        class="px-4 py-2 d-flex align-center right-radios"
      >
        <v-rating
          :model-value="rating"
          @update:modelValue="$emit('rating', $event)"
          length="5"
        >
          <!-- Customização do ícone da estrela -->
          <template #item="{ isFilled }">
            <IconStarFilled
              :fill="isFilled ? primary : info"
              :size="28"
            />
          </template>
        </v-rating>
      </v-sheet>

      <!-- Exibição da próxima lição e botão de navegação -->
      <div class="d-flex align-center">
        <div class="text-end me-6">
          <div class="text-caption text-accent">Próximo conteúdo:</div>
          <div class="text-h5 font-weight-regular text-accent">
            {{ nextTitle }}
          </div>
        </div>

        <!-- Botão de avançar -->
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
/**
 * LessonFooter.vue
 *
 * Componente fixo no rodapé da lição.
 * Responsável por:
 * - Exibir avaliação por estrelas (v-rating)
 * - Mostrar título da próxima lição
 * - Emissão de evento para avançar ("next")
 * - Customização de fluxo com base em `goToCourseAfterUnit`
 */

import { computed } from 'vue'
import { useTheme } from 'vuetify'
import IconStarFilled from '@/components/icons/IconStarFilled.vue'

// Props esperadas do componente pai
const props = defineProps({
  goToCourseAfterUnit: Boolean, // Se true, o botão leva ao curso após a unidade
  isCompleted: Boolean, // Controla a visibilidade do footer
  isUnitFinished: Boolean, // Informa se a unidade chegou ao fim
  rating: Number, // Avaliação atual do usuário
  nextTitle: String, // Título da próxima lição
})

// Eventos emitidos
const emit = defineEmits(['next', 'rating'])

// Tema atual da aplicação (usado para colorir as estrelas)
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
