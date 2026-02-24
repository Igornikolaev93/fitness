<template>
  <div>
    <h3>Exercises</h3>
    <ul>
      <li v-for="(exercise, index) in workoutStore.exercises" :key="index">{{ exercise.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '@/store/workouts'

const workoutStore = useWorkoutStore()
</script>