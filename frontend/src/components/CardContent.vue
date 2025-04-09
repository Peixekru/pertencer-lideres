<template>
  <v-card>
    <v-card-title>
      <!--{{ cards === null ? 'Carregando...' : cards[0].title }}-->
      Buscar texto do banco
    </v-card-title>

    <!--
    <v-card-title v-if="cards === null">Carregando...</v-card-title>
    <v-card-title v-else>{{ cards[0].title }}</v-card-title>
    -->

    <v-card-text>
      <v-icon
        icon="mdi-star"
        color="amber"
      ></v-icon>
      Conteúdo perfeitamente alinhado
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'

  const cards = ref(null)
  const loading = ref(false)

  /*
// Função para buscar os dados do backend
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/cards')
    cards.value = response.data
    //console.log(cards.value[0].title)
  } catch (err) {
    console.error('Erro ao buscar os dados:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchData()
})
  */
</script>
