<template>
  <v-app>
    <!-- Camada de cor (base ou gradiente) -->
    <div
      class="background-color-layer"
      :style="courseStore.backgroundColorStyle"
    ></div>
    <!-- Camada de imagem  -->
    <div
      v-if="courseStore.hasBackgroundImage"
      class="background-image-layer"
      :style="courseStore.backgroundImageStyle"
    ></div>
    <!-- App Bar -->
    <AppBar :progress="progress" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>


<script setup>
import { computed } from 'vue'
import { useCourseStore } from '@/store/course'
import { useProgressStore } from '@/store/progress'
import AppBar from '@/components/shared/AppBar.vue'
//import FloatingMenu from '@/components/shared/FloatingMenu.vue'

// Inicializa cores de fundo
const courseStore = useCourseStore()
// Inicializa progresso
const progressStore = useProgressStore()
// Progresso global do curso (calculado com base nas lições completas)
const progress = computed(() => progressStore.courseProgress)
</script>

<style lang="scss" scoped>
.background-color-layer,
.background-image-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2; // cor fica mais ao fundo
}
// Camada de imagem
.background-image-layer {
  z-index: -1; // imagem sobreposta à cor
}
</style>
