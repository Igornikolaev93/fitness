<template>
  <div>
    <h2>Assign Workout</h2>
    <select v-model="selectedClient">
      <option v-for="client in trainerStore.clients" :key="client.id" :value="client.id">
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
import { useTrainerStore } from '@/store/trainer'
import { useWorkoutStore } from '@/store/workout'
import { useUserStore } from '@/store/user'

const trainerStore = useTrainerStore()
const workoutStore = useWorkoutStore()
const userStore = useUserStore()
const workouts = ref([])
const selectedClient = ref(null)
const selectedWorkout = ref(null)

onMounted(async () => {
  if (userStore.currentUser?.id) {
    await trainerStore.fetchClients(userStore.currentUser.id)
  }
  workouts.value = await workoutStore.fetchWorkouts()
  selectedClient.value = trainerStore.clients.length > 0 ? trainerStore.clients[0].id : null
  selectedWorkout.value = workouts.value.length > 0 ? workouts.value[0].id : null
})

const assignWorkout = () => {
  const planData = {
    workoutId: selectedWorkout.value,
    // Add other plan data here, like date, etc.
  };
  trainerStore.createWorkoutPlan(selectedClient.value, planData)
}
</script>
