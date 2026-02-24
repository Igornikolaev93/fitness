<template>
  <div>
    <h2>My Clients</h2>
    <ul>
      <li v-for="client in clients" :key="client.id">
        {{ client.name }}
        <button @click="assignWorkout(client)">Assign Workout</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clients = ref([
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
  { id: 3, name: 'Client C' }
])

const emit = defineEmits(['assign-workout'])

const assignWorkout = (client) => {
  emit('assign-workout', client)
}
</script>