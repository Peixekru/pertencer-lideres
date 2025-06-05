<template>
  <v-dialog
    v-model="modal.isOpen"
    :max-width="modal.options.maxWidth || 600"
    :scrollable="modal.options.scrollable ?? true"
    persistent
    attach="body"
  >
    <v-card
      rounded="lg"
      class="pa-8"
      :style="{
        height: modal.options.height || 'auto',
        maxHeight: modal.options.maxHeight || 'none',
        overflowY: modal.options.scrollable === false ? 'hidden' : 'auto',
      }"
    >
      <component
        v-if="modal.component"
        :is="modal.component"
        v-bind="modal.props"
        @close="modal.closeModal"
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useModalStore } from '@/store/modal'
const modal = useModalStore()
</script>
