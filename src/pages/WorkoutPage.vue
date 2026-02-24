<template>
  <div>
    <h1>Workout</h1>
    <p>Workout ID: {{ $route.params.id }}</p>
    <ExerciseForm />
    <ExerciseList />
    <PerformanceTracker :workout-id="Number($route.params.id)" />
  </div>
</template>

<script setup>
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseList from '../components/ExerciseList.vue'
import PerformanceTracker from '../components/PerformanceTracker.vue'
</script>