<template>
  <v-app :theme="theme.global.name.value">
    
    <!--Navegação provisória-->
    <router-link class="mx-auto mt-6" to="/">go to Login</router-link>

    <v-main class="d-flex align-center justify-center fill-height">
      <v-container class="text-center">
        <div class="d-flex flex-column mx-auto" style="max-width: 75%">

          <!-- Ícones adicionados aqui -->
          <v-row justify="center" class="mb-4">
            <v-col cols="auto">
              <v-icon size="90" color="#41b883" icon="mdi-vuejs" />
            </v-col>
            <v-col cols="auto">
              <v-icon :size="90" color="#1867C0" icon="mdi-vuetify" />
            </v-col>
          </v-row>

          <!--Componente que modifica o tema da aplicação-->
          <SwithTheme />

          <!-- Exemplo de Botão primário -->
          <v-btn color="primary" variant="flat" block class="mb-4">
            Button Exemple
            <v-icon end icon="mdi-checkbox-marked-circle"></v-icon>
          </v-btn>

          <!--Component de card com conteúdo do DB-->
          <CardContent />

        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import axios from 'axios'

import SwithTheme from '@/components/SwithTheme.vue'
import CardContent from '@/components/CardContent.vue'

const theme = useTheme()
const cards = ref(null)
const loading = ref(false)

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/cards')
    cards.value = response.data
    console.log(cards.value[0].title)
  } catch (err) {
    console.error('Erro ao buscar os dados:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchData()
})
</script>