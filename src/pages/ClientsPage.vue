<template>
  <div>
    <h1>Clients</h1>
    <ClientList />
    <WorkoutList />
    <AssignWorkout />
  </div>
</template>

<script setup>
import ClientList from '@/components/ClientList.vue'
import WorkoutList from '@/components/WorkoutList.vue'
import AssignWorkout from '@/components/AssignWorkout.vue'
</script>