<template>
  <div>
    <h1>Clients</h1>
    <ClientsList />
    <WorkoutList />
    <AssignWorkout />
  </div>
</template>

<script setup>
import ClientsList from '@/components/ClientsList.vue'
import WorkoutList from '@/components/WorkoutList.vue'
import AssignWorkout from '@/components/AssignWorkout.vue'
</script>