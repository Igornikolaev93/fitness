<template>
  <div>
    <h2>Created Workouts</h2>
    <ul>
      <li v-for="workout in createdWorkouts" :key="workout.id">
        {{ workout.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workout'

const workoutStore = useWorkoutStore()
const createdWorkouts = ref([])

onMounted(async () => {
  createdWorkouts.value = await workoutStore.fetchCreatedWorkouts()
})
</script>