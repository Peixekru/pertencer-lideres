<template>
  <v-container class="pa-0">
    <v-divider class="my-8 border-opacity-25" />

    <!-- Cabeçalhos -->
    <v-row
      class="px-7 mb-7 text-h6 text-secondary font-weight-black"
      justify="space-between"
    >
      <span>Conteúdos</span>
      <span>Recomendações</span>
    </v-row>

    <!-- Lista de sugestões -->
    <v-container class="px-4 py-0 text-left">
      <div
        v-for="(unit, index) in suggestions"
        :key="index"
        class="mb-6"
      >
        <h6 class="text-subtitle-1 font-weight-bold text-primary mb-2">{{ unit.title }}</h6>
        <v-divider
          class="border-opacity-75"
          thickness="2"
          color="primary"
        />

        <v-container
          fluid
          v-for="(item, idx) in unit.items"
          :key="idx"
          class="d-flex justify-between align-center py-3 px-0 border-b border-opacity-50"
        >
          <v-sheet
            color="transparent"
            class="w-100"
          >
            <span class="text-body-2">Tema: {{ item.label }}</span>
          </v-sheet>
          <v-sheet color="transparent">
            <v-chip
              v-if="item.highlight"
              rounded="xl"
              color="primary"
              class="font-weight-black text-uppercase bg-yellow"
              size="small"
              label
            >
              <v-icon
                start
                icon="mdi-alert-circle"
              />
              Atenção
            </v-chip>
          </v-sheet>
        </v-container>
      </div>
    </v-container>
  </v-container>
</template>

<script setup>
const props = defineProps({
  suggestions: Array,
})
</script>
