<template>
  <div>
    <h1>Dashboard</h1>
    <WorkoutList />
    <TrainingProgress />
    <CreatedWorkouts />
  </div>
</template>

<script setup>
import WorkoutList from '@/components/WorkoutList.vue'
import TrainingProgress from '@/components/TrainingProgress.vue'
import CreatedWorkouts from '@/components/CreatedWorkouts.vue'
</script>