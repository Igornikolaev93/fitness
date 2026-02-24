<template>
  <div>
    <h2>Assign Workout</h2>
    <form @submit.prevent="assignWorkout">
      <label for="client">Select Client:</label>
      <select id="client" v-model="selectedClient">
        <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
      </select>

      <label for="workout">Select Workout:</label>
      <select id="workout" v-model="selectedWorkout">
        <option v-for="workout in workouts" :key="workout.id" :value="workout.id">{{ workout.name }}</option>
      </select>

      <button type="submit">Assign Workout</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const workoutStore = useWorkoutStore()

const selectedClient = ref(null)
const selectedWorkout = ref(null)
const clients = ref([])
const workouts = ref([])

onMounted(async () => {
  clients.value = await workoutStore.fetchClients()
  workouts.value = await workoutStore.fetchWorkouts()
})

const assignWorkout = () => {
  if (selectedClient.value && selectedWorkout.value) {
    workoutStore.assignWorkout(selectedClient.value, selectedWorkout.value)
  }
}
</script>