<template>
  <div>
    <ul>
      <li v-for="workout in workouts" :key="workout.id">
        {{ workout.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// This is a placeholder. In a real application, you would fetch the workouts for the selected child.
const workouts = ref([
  { id: 1, name: 'Assigned Workout 1' },
  { id: 2, name: 'Assigned Workout 2' }
])
</script>