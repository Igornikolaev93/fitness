<template>
  <div>
    <h1>Create Workout</h1>
    <ExerciseForm />
    <ExerciseList />
    <button @click="saveWorkout">Save Workout</button>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '@/store/workouts'
import ExerciseForm from '@/components/ExerciseForm.vue'
import ExerciseList from '@/components/ExerciseList.vue'

const workoutStore = useWorkoutStore()

const saveWorkout = () => {
  workoutStore.saveWorkout()
}
</script>
