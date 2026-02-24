import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

export const useWorkoutStore = defineStore('workout', () => {
  // Состояние
  const workouts = ref([])
  const currentWorkout = ref(null)
  const workoutHistory = ref([])
  const workoutOptions = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Геттеры
  const completedWorkouts = computed(() => 
    workoutHistory.value.filter(w => w.status === 'completed')
  )
  
  const plannedWorkouts = computed(() => 
    workoutHistory.value.filter(w => w.status === 'planned')
  )

  const totalWorkoutTime = computed(() => 
    workoutHistory.value.reduce((acc, w) => acc + (w.duration || 0), 0)
  )

  const totalCaloriesBurned = computed(() => 
    workoutHistory.value.reduce((acc, w) => acc + (w.calories || 0), 0)
  )

  // Действия
  async function fetchWorkouts(userId) {
    loading.value = true
    try {
      const response = await fetch(`/api/users/${userId}/workouts`)
      workouts.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchWorkoutHistory(userId) {
    loading.value = true
    try {
      const response = await fetch(`/api/users/${userId}/workouts/history`)
      workoutHistory.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function calculateWorkoutOptions(userId, workoutType) {
    loading.value = true
    try {
      const response = await fetch(`/api/users/${userId}/workouts/calculate`, {
        method: 'POST',
        body: JSON.stringify({ type: workoutType })
      })
      workoutOptions.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function selectWorkoutOption(optionId) {
    currentWorkout.value = workoutOptions.value.find(o => o.id === optionId)
  }

  async function startWorkout(workoutId) {
    loading.value = true
    try {
      const response = await fetch(`/api/workouts/${workoutId}/start`, {
        method: 'POST'
      })
      currentWorkout.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function completeWorkout(workoutId, completionData) {
    loading.value = true
    try {
      const response = await fetch(`/api/workouts/${workoutId}/complete`, {
        method: 'POST',
        body: JSON.stringify(completionData)
      })
      const completed = await response.json()
      workoutHistory.value.unshift(completed)
      
      // Обновляем статистику пользователя
      const userStore = useUserStore()
      if (userStore.currentUser) {
        await userStore.fetchUserProfile(userStore.currentUser.id)
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function scheduleWorkout(workoutData) {
    loading.value = true
    try {
      const response = await fetch('/api/workouts/schedule', {
        method: 'POST',
        body: JSON.stringify(workoutData)
      })
      const scheduled = await response.json()
      workoutHistory.value.push(scheduled)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // Состояние
    workouts,
    currentWorkout,
    workoutHistory,
    workoutOptions,
    loading,
    error,
    // Геттеры
    completedWorkouts,
    plannedWorkouts,
    totalWorkoutTime,
    totalCaloriesBurned,
    // Действия
    fetchWorkouts,
    fetchWorkoutHistory,
    calculateWorkoutOptions,
    selectWorkoutOption,
    startWorkout,
    completeWorkout,
    scheduleWorkout
  }
})