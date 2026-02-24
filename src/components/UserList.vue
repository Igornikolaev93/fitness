<template>
  <div>
    <h2>User Management</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.role }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'John Doe', role: 'Client' },
  { id: 2, name: 'Jane Smith', role: 'Coach' },
  { id: 3, name: 'Peter Jones', role: 'Parent' }
])
</script>