import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useParentStore = defineStore('parent', () => {
  // Состояние
  const children = ref([])
  const selectedChild = ref(null)
  const childProgress = ref(null)
  const childAttendance = ref([])
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Геттеры
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )

  const averageAttendance = computed(() => {
    if (childAttendance.value.length === 0) return 0
    const total = childAttendance.value.reduce((acc, day) => acc + (day.attended ? 1 : 0), 0)
    return Math.round((total / childAttendance.value.length) * 100)
  })

  const childAge = computed(() => {
    if (!selectedChild.value?.birthDate) return null
    const birthDate = new Date(selectedChild.value.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  })

  // Действия
  async function fetchChildren(parentId) {
    loading.value = true
    try {
      const response = await fetch(`/api/parents/${parentId}/children`)
      children.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchChildProgress(childId, period = 'month') {
    loading.value = true
    try {
      const response = await fetch(`/api/children/${childId}/progress?period=${period}`)
      childProgress.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchChildAttendance(childId, month, year) {
    loading.value = true
    try {
      const response = await fetch(`/api/children/${childId}/attendance?month=${month}&year=${year}`)
      childAttendance.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchNotifications(parentId) {
    loading.value = true
    try {
      const response = await fetch(`/api/parents/${parentId}/notifications`)
      notifications.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function markNotificationAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
    }
  }

  async function markAllNotificationsAsRead() {
    notifications.value.forEach(n => n.read = true)
    await fetch('/api/notifications/read-all', {
      method: 'POST'
    })
  }

  function selectChild(childId) {
    selectedChild.value = children.value.find(c => c.id === childId)
  }

  async function sendMessageToTrainer(childId, message) {
    loading.value = true
    try {
      await fetch(`/api/children/${childId}/message-trainer`, {
        method: 'POST',
        body: JSON.stringify({ message })
      })
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function getChildAchievements(childId) {
    loading.value = true
    try {
      const response = await fetch(`/api/children/${childId}/achievements`)
      return await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // Состояние
    children,
    selectedChild,
    childProgress,
    childAttendance,
    notifications,
    loading,
    error,
    // Геттеры
    unreadNotifications,
    averageAttendance,
    childAge,
    // Действия
    fetchChildren,
    fetchChildProgress,
    fetchChildAttendance,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    selectChild,
    sendMessageToTrainer,
    getChildAchievements
  }
})