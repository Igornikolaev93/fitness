<template>
  <form @submit.prevent="addExercise">
    <input type="text" v-model="exerciseName" placeholder="Exercise Name">
    <button type="submit">Add Exercise</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const exerciseName = ref('')
const emit = defineEmits(['add-exercise'])

const addExercise = () => {
  if (exerciseName.value.trim()) {
    emit('add-exercise', exerciseName.value.trim())
    exerciseName.value = ''
  }
}
</script>