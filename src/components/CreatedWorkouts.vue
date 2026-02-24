<template>
  <div>
    <h2>Created Workouts</h2>
    <ul>
      <li v-for="workout in createdWorkouts" :key="workout.id">
        <h3>{{ workout.name }}</h3>
        <ul>
          <li v-for="exercise in workout.exercises" :key="exercise.id">
            {{ exercise.name }} - {{ exercise.sets }} sets, {{ exercise.reps }} reps
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const workoutStore = useWorkoutStore()
const createdWorkouts = ref([])

onMounted(async () => {
  createdWorkouts.value = await workoutStore.fetchCreatedWorkouts()
})
</script>
