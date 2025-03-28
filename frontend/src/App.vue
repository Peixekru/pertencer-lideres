<template>
  <v-app :theme="theme.global.name.value">
    <v-main class="d-flex align-center justify-center fill-height">
      <v-container class="text-center">
        <div class="d-flex flex-column mx-auto" style="max-width: 75%">

          <!-- Ícones adicionados aqui -->
          <v-row justify="center" class="mb-4">
            <v-col cols="auto">
              <v-icon size="90"
                color="#41b883"
                icon="mdi-vuejs"
                />
            </v-col>
            <v-col cols="auto">
              <v-icon :size="90"
                color="#1867C0"
                icon="mdi-vuetify"
                />
            </v-col>
          </v-row>

          <!-- Botão de tema com margem inferior -->
          <v-btn @click="toggleTheme" variant="outlined"
            :prepend-icon="theme.global.name.value === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'" class="mb-4">
            `{{ theme.global.name.value }} mode`
          </v-btn>

          <!-- Botão primário com margem inferior -->
          <v-btn color="primary" variant="flat" block class="mb-4">
            Button Exemple
            <v-icon end icon="mdi-checkbox-marked-circle"></v-icon>
          </v-btn>

          <!-- Card sem margem interna -->
          <v-card>
            <v-card-title>Card Centralizado</v-card-title>
            <v-card-text>
              <v-icon icon="mdi-star" color="amber"></v-icon>
              Conteúdo perfeitamente alinhado
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}
</script>