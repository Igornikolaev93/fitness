<template>
  <div>
    <h2>Workouts</h2>
    <ul>
      <li v-for="workout in workouts" :key="workout.id">
        <router-link :to="'/workout/' + workout.id">{{ workout.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const workouts = ref([
  { id: 1, name: 'Push Day' },
  { id: 2, name: 'Pull Day' },
  { id: 3, name: 'Leg Day' }
])
</script>