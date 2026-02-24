<template>
  <header>
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/admin">Admin</router-link>
      <router-link to="/parent">Parent</router-link>
      <router-link to="/coach">Coach</router-link>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
nav a {
  color: white;
  margin-right: 1rem;
}
</style>