<template>
  <div>
    <h3>Exercises</h3>
    <ul>
      <li v-for="exercise in exercises" :key="exercise.id">{{ exercise.name }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  exercises: {
    type: Array,
    required: true
  }
})
</script>