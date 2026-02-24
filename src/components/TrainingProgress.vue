<template>
  <div>
    <h3>Training Progress</h3>
    <select v-model="selectedWorkout">
      <option v-for="workout in workouts" :key="workout.id" :value="workout.id">
        {{ workout.name }}
      </option>
    </select>
    <ul>
      <li v-for="record in filteredHistory" :key="record.date">
        {{ new Date(record.date).toLocaleDateString() }} - Sets: {{ record.sets }}, Reps: {{ record.reps }}, Weight: {{ record.weight }}kg, Load: {{ record.load }}kg
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWorkoutStore } from '@/store/workout'

const workoutStore = useWorkoutStore()
const workouts = workoutStore.workouts
const selectedWorkout = ref(workouts.length > 0 ? workouts[0].id : null)

const filteredHistory = computed(() => {
  return workoutStore.performanceHistory.filter(
    (record) => record.workoutId === selectedWorkout.value
  )
})
</script>
