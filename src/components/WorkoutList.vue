<template>
  <div>
    <ul>
      <li v-for="workout in trainerStore.clientWorkouts" :key="workout.id">
        {{ workout.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useTrainerStore } from '@/store/trainer'

const trainerStore = useTrainerStore();

watch(() => trainerStore.selectedClient, (newClient) => {
  if (newClient) {
    trainerStore.fetchClientWorkouts(newClient.id);
  }
});
</script>