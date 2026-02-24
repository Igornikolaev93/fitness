<template>
  <div>
    <h2>Clients</h2>
    <ul>
      <li v-for="client in trainerStore.clients" :key="client.id">
        {{ client.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTrainerStore } from '@/store/trainer'
import { useUserStore } from '@/store/user'

const trainerStore = useTrainerStore();
const userStore = useUserStore();

onMounted(async () => {
  if (userStore.currentUser?.id) {
    await trainerStore.fetchClients(userStore.currentUser.id)
  }
})
</script>