<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const login = () => {
  // Mock login logic
  if (email.value === 'coach@example.com' && password.value === 'password') {
    router.push('/dashboard')
  } else if (email.value === 'parent@example.com' && password.value === 'password') {
    router.push('/parent')
  } else if (email.value === 'admin@example.com' && password.value === 'password') {
    router.push('/admin')
  } else {
    alert('Invalid credentials')
  }
}
</script>