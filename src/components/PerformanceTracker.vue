<template>
  <div>
    <h3>Track Performance</h3>
    <form @submit.prevent="recordPerformance">
      <div>
        <label for="sets">Sets:</label>
        <input type-="number" id="sets" v-model.number="performance.sets" />
      </div>
      <div>
        <label for="reps">Reps:</label>
        <input type="number" id="reps" v-model.number="performance.reps" />
      </div>
      <div>
        <label for="weight">Weight (kg):</label>
        <input type="number" id="weight" v-model.number="performance.weight" />
      </div>
      <button type="submit">Record Performance</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const props = defineProps({
  workoutId: {
    type: Number,
    required: true
  }
})

const workoutStore = useWorkoutStore()

const performance = ref({
  sets: 0,
  reps: 0,
  weight: 0
})

const recordPerformance = () => {
  workoutStore.recordPerformance({
    workoutId: props.workoutId,
    ...performance.value
  })
  // Reset form
  performance.value.sets = 0
  performance.value.reps = 0
  performance.value.weight = 0
}
</script>
