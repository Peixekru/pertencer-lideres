<template>
  <v-app theme="dark">
    <DeclarativeEditor
      :config="config"
      :model="form"
      :loadFn="loadAll"
      :saveFn="saveAll"
    />
  </v-app>
</template>


<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import DeclarativeEditor from '@/components/DeclarativeEditor.vue'

const config = [
  {
    section: 'Login',
    model: 'space',
    fields: [
      { key: 'login_logo_url', label: 'Logo do Login', type: 'image' },
      { key: 'login_background_color_1', label: 'Cor Primária', type: 'color' },
      { key: 'login_background_color_2', label: 'Cor Secundária', type: 'color' },
      { key: 'login_background_image_url', label: 'Imagem de Fundo', type: 'image' },
      { key: 'footer_logo_url', label: 'Logo do Rodapé', type: 'image' },
    ],
  },
  {
    section: 'Curso',
    model: 'course',
    fields: [
      { key: 'title', label: 'Título do Curso', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'background_color_1', label: 'Cor Principal', type: 'color' },
      { key: 'background_color_2', label: 'Cor Secundária', type: 'color' },
      { key: 'background_image_url', label: 'Imagem de Fundo', type: 'image' },
      {
        key: 'selectedThemeKey',
        label: 'Tema da Plataforma',
        type: 'select',
        options: [
          { label: 'Claro', value: 'light' },
          { label: 'Escuro', value: 'dark' },
          { label: 'Claro Monocromático', value: 'light_mono' },
          { label: 'Escuro Monocromático', value: 'dark_mono' },
        ],
      },
    ],
  },
  {
    section: 'Unidades',
    model: 'unit',
    collection: true,
    idField: 'id',
    labelField: 'title',
    fields: [{ key: 'image_url', label: 'Imagem da Unidade', type: 'image' }],
  },
]

const form = reactive({
  space: {},
  course: {},
  unit: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Unidade ${i + 1}`,
    image_url: '',
  })),
})

async function loadAll() {
  const [space, courseRes, unitRes] = await Promise.all([
    axios.get('/api/editor-config/space'),
    axios.get('/api/editor-config/course'),
    axios.get('/api/editor-config/unit'),
  ])

  return {
    space: space.data,
    course: courseRes.data,
    unit: unitRes.data,
  }
}

async function saveAll() {
  await Promise.all([
    axios.put('/api/editor-config/space', form.space),
    axios.put('/api/editor-config/course', form.course),
    axios.put('/api/editor-config/unit', form.unit),
  ])
}
</script>

<style scoped>
h2 {
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}
input {
  border-color: #333 !important;
}
</style>
