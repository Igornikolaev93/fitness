<template>
  <div>
    <h2>My Children</h2>
    <ul>
      <li v-for="child in children" :key="child.id">
        {{ child.name }}
        <button @click="viewWorkouts(child)">View Workouts</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const children = ref([
  { id: 1, name: 'Child A' },
  { id: 2, name: 'Child B' }
])

const emit = defineEmits(['view-workouts'])

const viewWorkouts = (child) => {
  emit('view-workouts', child)
}
</script>