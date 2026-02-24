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
        <option v-for="workout in workoutStore.workouts" :key="workout.id" :value="workout.id">{{ workout.name }}</option>
      </select>

      <button type="submit" :disabled="workoutStore.loading">{{ workoutStore.loading ? 'Assigning...' : 'Assign Workout' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/workout'
import { useUserStore } from '@/store/user'

const workoutStore = useWorkoutStore()
const userStore = useUserStore()

const selectedClient = ref(null)
const selectedWorkout = ref(null)
const clients = ref([])

onMounted(async () => {
  // Assuming you have a way to get clients, maybe from the user store?
  // clients.value = await userStore.fetchClients() 
  await workoutStore.fetchWorkouts(userStore.currentUser.id)
})

const assignWorkout = () => {
  if (selectedClient.value && selectedWorkout.value) {
    workoutStore.scheduleWorkout({ userId: selectedClient.value, workoutId: selectedWorkout.value })
  }
}
</script>