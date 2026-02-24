<template>
  <div>
    <h1>Workout</h1>
    <p>Workout ID: {{ $route.params.id }}</p>
    <ExerciseForm />
    <ExerciseList />
  </div>
</template>

<script setup>
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseList from '../components/ExerciseList.vue'
</script>