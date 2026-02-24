<template>
  <div>
    <h2>Clients</h2>
    <ul>
      <li v-for="client in clients" :key="client.id">
        {{ client.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const workoutStore = useWorkoutStore()
const clients = ref([])

onMounted(async () => {
  clients.value = await workoutStore.fetchClients()
})
</script>