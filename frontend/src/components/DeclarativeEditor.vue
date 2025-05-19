<script setup>
import { onMounted } from 'vue'
import api from '@/composables/useApi'

const props = defineProps({
  config: Array,
  model: Object,
  loadFn: Function,
  saveFn: Function,
  saveFnUn: Function,
  loadFnUn: Function,
  resetFnUn: Function,
})

const form = props.model

onMounted(async () => {
  const data = await props.loadFn()

  if (data && typeof data === 'object') {
    for (const key of Object.keys(form)) {
      if (data[key]) {
        if (Array.isArray(form[key])) {
          form[key].splice(0, form[key].length, ...data[key])
        } else {
          Object.assign(form[key], data[key])
        }
      }
    }
  }
})

function getFieldGroups(fields) {
  const groups = []
  let i = 0
  while (i < fields.length) {
    const current = fields[i]
    const next = fields[i + 1]
    if (current.type === 'color' && next?.type === 'color') {
      groups.push([current, next])
      i += 2
    } else {
      groups.push(current)
      i++
    }
  }
  return groups
}

async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await api.post('/editor-config/uploads', formData)
    return data.url
  } catch (err) {
    console.error('❌ Erro ao fazer upload da imagem', err)
    return null
  }
}

async function handleImageUpload(event, field, model) {
  const file = event?.target?.files?.[0] || event?.[0] || event
  if (!file) return

  const path = await uploadImage(file)
  if (path) form[model][field.key] = path
}

async function handleCollectionImageUpload(event, field, item) {
  const file = event?.target?.files?.[0] || event?.[0] || event
  if (!file) return
  const path = await uploadImage(file)
  if (path) {
    console.log('✅ Novo image_url:', path)
    item[field.key] = path
  }
}

function saveSpace() {
  props.saveFn(form.space)
}

function saveCourse() {
  api.put('/editor-config/course', form.course)
}

function saveUnit() {
  api.put('/editor-config/unit', form.unit)
}

async function resetSpace() {
  try {
    await api.post('/editor-config/space/reset')
    await props.loadFn().then((data) => Object.assign(form.space, data))
  } catch (err) {
    console.error('Erro ao resetar configurações do espaço:', err)
  }
}

async function resetCourse() {
  try {
    await api.post('/editor-config/course/reset')
    const { data } = await api.get('/editor-config/course')
    Object.assign(form.course, data)
  } catch (err) {
    console.error('Erro ao resetar configurações do curso:', err)
  }
}

async function resetUnit() {
  try {
    await api.post('/editor-config/unit/reset')
    const { data } = await api.get('/editor-config/unit')
    form.unit.splice(0, form.unit.length, ...data)
  } catch (err) {
    console.error('Erro ao resetar configurações das unidades:', err)
  }
}
</script>

<template>
  <v-container class="pa-6 mt-10">
    <v-row
      v-for="section in config"
      :key="section.section"
      class="mb-12 mx-auto"
      style="max-width: 650px"
    >
      <v-col cols="12">
        <h2 class="text-h6 mb-8">{{ section.section }}</h2>

        <template v-if="section.collection">
          <v-row
            v-for="item in form[section.model]"
            :key="item[section.idField]"
            class="mb-12"
          >
            <v-col cols="12">
              <v-text-field
                v-if="section.labelField"
                v-model="item[section.labelField]"
                :label="section.labelField"
              />
            </v-col>
            <v-col
              v-for="field in section.fields"
              :key="field.key"
              cols="12"
            >
              <v-container class="d-flex justify-center my-6 gap-2">
                <v-img
                  v-if="item[field.key]"
                  :src="item[field.key]"
                  class="mb-2"
                  max-width="400px"
                  cover
                  rounded="lg"
                />
              </v-container>
              <v-file-input
                v-if="field.type === 'image'"
                :label="field.label"
                accept="image/*"
                prepend-icon="mdi-image"
                @change="handleCollectionImageUpload($event, field, item)"
              />
            </v-col>
          </v-row>
          <v-col
            cols="12"
            class="d-flex justify-end mt-6 gap-2"
          >
            <v-btn
              color="grey"
              variant="outlined"
              class="mx-2"
              @click="resetUnit"
            >
              Resetar
            </v-btn>
            <v-btn
              color="primary"
              class="mx-2"
              @click="saveUnit"
            >
              Aplicar
            </v-btn>
          </v-col>
        </template>

        <template v-else>
          <v-row>
            <template v-for="field in getFieldGroups(section.fields)">
              <template v-if="Array.isArray(field)">
                <v-col
                  :key="field[0].key"
                  cols="12"
                  md="6"
                  class="mb-8"
                >
                  <v-label>{{ field[0].label }}</v-label>
                  <v-color-picker
                    v-model="form[section.model][field[0].key]"
                    flat
                    rounded="lg"
                    hide-canvas
                    show-swatches
                    swatches-max-height="240"
                    mode="hex"
                  />
                </v-col>
                <v-col
                  :key="field[1].key"
                  cols="12"
                  md="6"
                >
                  <v-label>{{ field[1].label }}</v-label>
                  <v-color-picker
                    v-model="form[section.model][field[1].key]"
                    flat
                    rounded="lg"
                    hide-canvas
                    show-swatches
                    swatches-max-height="240"
                    mode="hex"
                  />
                </v-col>
              </template>

              <template v-else>
                <v-col
                  :key="field.key"
                  cols="12"
                >
                  <v-text-field
                    v-if="field.type === 'text'"
                    v-model="form[section.model][field.key]"
                    :label="field.label"
                  />
                  <v-color-picker
                    v-if="field.type === 'color'"
                    v-model="form[section.model][field.key]"
                    flat
                    hide-canvas
                    show-swatches
                    swatches-max-height="240"
                    mode="hex"
                  />
                  <v-select
                    v-if="field.type === 'select'"
                    :label="field.label"
                    v-model="form[section.model][field.key]"
                    :items="field.options"
                    item-title="label"
                    item-value="value"
                  />
                  <v-container
                    fluid
                    class="d-flex justify-center"
                  >
                    <v-img
                      v-if="form[section.model][field.key] && field.type === 'image'"
                      :src="form[section.model][field.key]"
                      class="my-6"
                      max-width="400px"
                      cover
                      rounded="lg"
                    />
                  </v-container>
                  <v-file-input
                    v-if="field.type === 'image'"
                    :label="field.label"
                    accept="image/*"
                    prepend-icon="mdi-image"
                    @change="handleImageUpload($event, field, section.model)"
                  />
                </v-col>
              </template>
            </template>

            <v-col
              v-if="section.model === 'space'"
              cols="12"
              class="d-flex justify-end mt-6 gap-2"
            >
              <v-btn
                color="grey"
                variant="outlined"
                class="mx-2"
                @click="resetSpace"
              >
                Resetar
              </v-btn>
              <v-btn
                color="primary"
                class="mx-2"
                @click="saveSpace"
              >
                Aplicar
              </v-btn>
            </v-col>

            <v-col
              v-if="section.model === 'course'"
              cols="12"
              class="d-flex justify-end mt-6 gap-2"
            >
              <v-btn
                color="grey"
                variant="outlined"
                class="mx-2"
                @click="resetCourse"
              >
                Resetar
              </v-btn>
              <v-btn
                color="primary"
                class="mx-2"
                @click="saveCourse"
              >
                Aplicar
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
h2 {
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}
input {
  border-color: #333 !important;
}
</style>
