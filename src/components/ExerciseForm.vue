<template>
  <form @submit.prevent="addExercise">
    <input type="text" v-model="exerciseName" placeholder="Exercise Name">
    <button type="submit">Add Exercise</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkoutStore } from '@/store/workout'

const exerciseName = ref('')
const workoutStore = useWorkoutStore()

const addExercise = () => {
  if (exerciseName.value.trim()) {
    workoutStore.addExercise({ name: exerciseName.value.trim() })
    exerciseName.value = ''
  }
}
</script>