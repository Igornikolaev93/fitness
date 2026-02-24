<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await userStore.login({ email: email.value, password: password.value })
  if (userStore.isAuthenticated) {
    router.push('/dashboard')
  } 
}
</script>