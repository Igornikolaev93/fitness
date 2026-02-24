<template>
  <div>
    <h3>Select a Workout</h3>
    <ul>
      <li v-for="workout in workouts" :key="workout.id" @click="selectWorkout(workout)">
        {{ workout.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const workouts = ref([
  { id: 1, name: 'Workout 1' },
  { id: 2, name: 'Workout 2' },
  { id: 3, name: 'Workout 3' }
])

const emit = defineEmits(['select-workout'])

const selectWorkout = (workout) => {
  emit('select-workout', workout)
}
</script>