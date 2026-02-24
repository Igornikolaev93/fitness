import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Состояние
  const currentUser = ref(null)
  const userProfile = ref(null)
  const userSettings = ref({
    notifications: true,
    language: 'ru',
    theme: 'light'
  })
  const loading = ref(false)
  const error = ref(null)
  const userStats = ref({
    avgLoad: 0,
    avgHeartRate: 0,
    intensity: 0,
    previousWorkouts: []
  })

  // Геттеры
  const isAuthenticated = computed(() => !!currentUser.value)
  const userName = computed(() => currentUser.value?.name || '')
  const userRole = computed(() => currentUser.value?.role || 'user')

  // Действия
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      // Имитация API запроса
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      currentUser.value = data.user
      await fetchUserProfile(data.user.id)
      await fetchUserStats(data.user.id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    currentUser.value = null
    userProfile.value = null
    userStats.value = {
      avgLoad: 0,
      avgHeartRate: 0,
      intensity: 0,
      previousWorkouts: []
    }
  }

  async function fetchUserProfile(userId) {
    loading.value = true
    try {
      // Имитация API запроса
      const response = await fetch(`/api/users/${userId}/profile`)
      userProfile.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchUserStats(userId) {
    loading.value = true
    try {
      // Имитация API запроса
      const response = await fetch(`/api/users/${userId}/stats`)
      userStats.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    try {
      const response = await fetch(`/api/users/${currentUser.value.id}/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })
      userProfile.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function updateSettings(settings) {
    userSettings.value = { ...userSettings.value, ...settings }
  }

  return {
    // Состояние
    currentUser,
    userProfile,
    userSettings,
    loading,
    error,
    userStats,
    // Геттеры
    isAuthenticated,
    userName,
    userRole,
    // Действия
    login,
    logout,
    fetchUserProfile,
    fetchUserStats,
    updateProfile,
    updateSettings
  }
})