<template>
  <div>
    <h1>Parent Dashboard</h1>
    <ChildList @view-workouts="handleViewWorkouts" v-if="!selectedChild" />
    <div v-if="selectedChild">
      <h2>{{ selectedChild.name }}'s Workouts</h2>
      <WorkoutList />
      <button @click="selectedChild = null">Back to Children</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChildList from '../components/ChildList.vue'
import WorkoutList from '../components/WorkoutList.vue'

const selectedChild = ref(null)

const handleViewWorkouts = (child) => {
  selectedChild.value = child
}
</script>