<template>
  <div>
    <h1>Workout</h1>
    <p>Workout ID: {{ $route.params.id }}</p>
    <ExerciseForm @add-exercise="handleAddExercise" />
    <ExerciseList :exercises="exercises" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseList from '../components/ExerciseList.vue'

const exercises = ref([])

const handleAddExercise = (exerciseName) => {
  const newExercise = {
    id: Date.now(),
    name: exerciseName
  }
  exercises.value.push(newExercise)
  console.log('Exercise added:', newExercise)
}
</script>