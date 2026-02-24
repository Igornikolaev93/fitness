<template>
  <div>
    <h2>Assign Workout</h2>
    <select v-model="selectedClient">
      <option v-for="client in clients" :key="client.id" :value="client.id">
        {{ client.name }}
      </option>
    </select>
    <select v-model="selectedWorkout">
      <option v-for="workout in workouts" :key="workout.id" :value="workout.id">
        {{ workout.name }}
      </option>
    </select>
    <button @click="assignWorkout">Assign Workout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workouts'

const workoutStore = useWorkoutStore()
const clients = ref([])
const workouts = ref([])
const selectedClient = ref(null)
const selectedWorkout = ref(null)

onMounted(async () => {
  clients.value = await workoutStore.fetchClients()
  workouts.value = await workoutStore.fetchWorkouts()
  selectedClient.value = clients.value.length > 0 ? clients.value[0].id : null
  selectedWorkout.value = workouts.value.length > 0 ? workouts.value[0].id : null
})

const assignWorkout = () => {
  workoutStore.assignWorkout(selectedClient.value, selectedWorkout.value)
}
</script>
