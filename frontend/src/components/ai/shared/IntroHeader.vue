<template>
  <v-row
    align="center"
    class="text-left"
  >
    <!-- Avatar -->
    <v-col
      cols="12"
      sm="auto"
      class="d-flex justify-center justify-sm-start"
    >
      <v-avatar size="120">
        <v-img
          src="/assets/avatar-2x.png"
          alt="Avatar"
          contain
          lazy-src="/assets/avatar-2x.png"
          transition="fade-transition"
        />
      </v-avatar>
    </v-col>
    <!-- Texto -->
    <v-col>
      <p class="text-body-1">{{ text }}</p>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>