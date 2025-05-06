<template>
  <v-app>
    <!--Navegação provisória-->
    <router-link
      class="mx-auto mt-6"
      to="/"
    >
      go to Login
    </router-link>

    <v-main class="d-flex align-center justify-center fill-height">
      <v-container class="text-center">
        <div
          class="d-flex flex-column mx-auto"
          style="max-width: 75%"
        >
          <!-- Ícones adicionados aqui -->
          <v-row
            justify="center"
            class="mb-4"
          >
            <v-col cols="auto">
              <v-icon
                size="90"
                color="#41b883"
                icon="mdi-vuejs"
              />
            </v-col>
            <v-col cols="auto">
              <v-icon
                :size="90"
                color="#1867C0"
                icon="mdi-vuetify"
              />
            </v-col>
          </v-row>

          <Logout />
          <!--Componente que modifica o tema da aplicação-->
          <SwithTheme />

          <!-- Exemplo de Botão primário -->
          <v-btn
            color="primary"
            variant="flat"
            block
            class="mb-4"
          >
            Button Exemple
            <v-icon
              end
              icon="mdi-checkbox-marked-circle"
            ></v-icon>
          </v-btn>

          <!--Component de card com conteúdo do DB-->
          <CardContent />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useCourseStore } from '@/store/course'
  import { useAuthStore } from '@/store/auth'
  import SwithTheme from '@/components/SwithTheme.vue'
  import CardContent from '@/components/CardContent.vue'
  import Logout from '@/components/Logout.vue'
  import logger from '#logger'

  const courseStore = useCourseStore()
  const authStore = useAuthStore()

  onMounted(async () => {
    logger.stInf('Infos de login:', authStore.user, authStore.token)

    const userId = authStore.user?.id
    if (userId) {
      await courseStore.fetchUserCourses(userId)
    }

    await courseStore.fetchUserCourses(userId)

    logger.stInf('Lista de cursos:', courseStore.userCourses)

    if (courseStore.userCourses && courseStore.userCourses.length > 0) {
      const firstUserCourse = courseStore.userCourses[0]
      await courseStore.fetchUserCourseDetails(firstUserCourse.user_course_id)

      logger.stInf('Primeiro curso da lista:', courseStore.currentCourse)
    }
  })
</script>
