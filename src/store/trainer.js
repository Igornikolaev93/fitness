import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTrainerStore = defineStore('trainer', () => {
  // Состояние
  const clients = ref([])
  const selectedClient = ref(null)
  const schedule = ref([])
  const clientWorkouts = ref([])
  const trainerStats = ref({
    totalClients: 0,
    todayWorkouts: 0,
    avgProgress: 0,
    hoursThisWeek: 0
  })
  const loading = ref(false)
  const error = ref(null)

  // Геттеры
  const activeClients = computed(() => 
    clients.value.filter(c => c.status === 'active')
  )

  const inactiveClients = computed(() => 
    clients.value.filter(c => c.status === 'inactive')
  )

  const todaySchedule = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return schedule.value.filter(s => s.date === today)
  })

  const clientsByProgress = computed(() => {
    return [...clients.value].sort((a, b) => b.progress - a.progress)
  })

  // Действия
  async function fetchClients(trainerId) {
    loading.value = true
    try {
      const response = await fetch(`/api/trainers/${trainerId}/clients`)
      clients.value = await response.json()
      await calculateTrainerStats()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchClientDetails(clientId) {
    loading.value = true
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      selectedClient.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchClientWorkouts(clientId, period = 'month') {
    loading.value = true
    try {
      const response = await fetch(`/api/clients/${clientId}/workouts?period=${period}`)
      clientWorkouts.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchSchedule(trainerId, startDate, endDate) {
    loading.value = true
    try {
      const response = await fetch(
        `/api/trainers/${trainerId}/schedule?start=${startDate}&end=${endDate}`
      )
      schedule.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createWorkoutPlan(clientId, planData) {
    loading.value = true
    try {
      const response = await fetch(`/api/clients/${clientId}/workout-plan`, {
        method: 'POST',
        body: JSON.stringify(planData)
      })
      const newPlan = await response.json()
      
      // Обновляем данные клиента
      const client = clients.value.find(c => c.id === clientId)
      if (client) {
        client.workoutPlans = client.workoutPlans || []
        client.workoutPlans.push(newPlan)
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateClientProgress(clientId, progressData) {
    loading.value = true
    try {
      const response = await fetch(`/api/clients/${clientId}/progress`, {
        method: 'PUT',
        body: JSON.stringify(progressData)
      })
      const updated = await response.json()
      
      const index = clients.value.findIndex(c => c.id === clientId)
      if (index !== -1) {
        clients.value[index] = updated
      }
      
      await calculateTrainerStats()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addWorkoutToSchedule(workoutData) {
    loading.value = true
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        body: JSON.stringify(workoutData)
      })
      const newWorkout = await response.json()
      schedule.value.push(newWorkout)
      
      // Обновляем статистику
      trainerStats.value.todayWorkouts = schedule.value.filter(
        s => s.date === new Date().toISOString().split('T')[0]
      ).length
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function markWorkoutAsCompleted(workoutId, completionData) {
    loading.value = true
    try {
      const response = await fetch(`/api/workouts/${workoutId}/complete`, {
        method: 'POST',
        body: JSON.stringify(completionData)
      })
      const completed = await response.json()
      
      // Обновляем расписание
      const workoutIndex = schedule.value.findIndex(w => w.id === workoutId)
      if (workoutIndex !== -1) {
        schedule.value[workoutIndex].status = 'completed'
        schedule.value[workoutIndex].completionData = completed
      }
      
      // Обновляем прогресс клиента
      if (completed.clientId) {
        await fetchClientDetails(completed.clientId)
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function sendMessageToClient(clientId, message) {
    loading.value = true
    try {
      await fetch(`/api/clients/${clientId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
      })
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function calculateTrainerStats() {
    trainerStats.value.totalClients = clients.value.length
    trainerStats.value.avgProgress = Math.round(
      clients.value.reduce((acc, c) => acc + (c.progress || 0), 0) / clients.value.length
    )
    
    const today = new Date().toISOString().split('T')[0]
    trainerStats.value.todayWorkouts = schedule.value.filter(
      s => s.date === today
    ).length
    
    // Расчет часов за неделю
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekWorkouts = schedule.value.filter(s => 
      new Date(s.date) >= weekStart
    )
    trainerStats.value.hoursThisWeek = weekWorkouts.reduce(
      (acc, w) => acc + (w.duration || 0), 0
    ) / 60
  }

  return {
    // Состояние
    clients,
    selectedClient,
    schedule,
    clientWorkouts,
    trainerStats,
    loading,
    error,
    // Геттеры
    activeClients,
    inactiveClients,
    todaySchedule,
    clientsByProgress,
    // Действия
    fetchClients,
    fetchClientDetails,
    fetchClientWorkouts,
    fetchSchedule,
    createWorkoutPlan,
    updateClientProgress,
    addWorkoutToSchedule,
    markWorkoutAsCompleted,
    sendMessageToClient,
    calculateTrainerStats
  }
})