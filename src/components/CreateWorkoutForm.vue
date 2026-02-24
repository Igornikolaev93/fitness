<template>
  <form @submit.prevent="createWorkout">
    <input type="text" v-model="workoutName" placeholder="Workout Name">
    <button type="submit">Create Workout</button>
  </form>
  <button @click="saveWorkout">Save Workout</button>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const workoutName = ref('')
const emit = defineEmits(['create-workout'])
const workoutStore = useWorkoutStore()

const createWorkout = () => {
  if (workoutName.value.trim()) {
    emit('create-workout', workoutName.value.trim())
    workoutName.value = ''
  }
}

const saveWorkout = () => {
  workoutStore.saveWorkout()
}
</script>