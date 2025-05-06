<template>
  <div>
    <button @click="handleLogout">Sair</button>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const handleLogout = async () => {
    await authStore.logout()
  }
</script>
