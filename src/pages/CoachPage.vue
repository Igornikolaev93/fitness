<template>
  <div>
    <h1>Coach Dashboard</h1>
    <ClientList @assign-workout="handleAssignWorkout" v-if="!selectedClient" />
    <WorkoutSelection @select-workout="handleWorkoutSelection" v-if="selectedClient" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClientList from '../components/ClientList.vue'
import WorkoutSelection from '../components/WorkoutSelection.vue'

const selectedClient = ref(null)

const handleAssignWorkout = (client) => {
  selectedClient.value = client
}

const handleWorkoutSelection = (workout) => {
  // Handle the logic for assigning the selected workout to the selected client
  console.log(`Assigning workout ${workout.name} to client ${selectedClient.value.name}`)
  // Reset the view after assignment
  selectedClient.value = null
}
</script>