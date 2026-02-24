import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlgorithmStore = defineStore('algorithm', () => {
  // Состояние
  const algorithms = ref([])
  const factors = ref([])
  const rules = ref([])
  const currentAlgorithm = ref(null)
  const algorithmHistory = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Геттеры
  const activeAlgorithms = computed(() => 
    algorithms.value.filter(a => a.active)
  )

  const enabledFactors = computed(() => 
    factors.value.filter(f => f.enabled)
  )

  const activeRules = computed(() => 
    rules.value.filter(r => r.active)
  )

  // Действия
  async function fetchAlgorithms() {
    loading.value = true
    try {
      const response = await fetch('/api/admin/algorithms')
      algorithms.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchFactors() {
    loading.value = true
    try {
      const response = await fetch('/api/admin/factors')
      factors.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchRules() {
    loading.value = true
    try {
      const response = await fetch('/api/admin/rules')
      rules.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchAlgorithmHistory() {
    loading.value = true
    try {
      const response = await fetch('/api/admin/algorithms/history')
      algorithmHistory.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createAlgorithm(algorithmData) {
    loading.value = true
    try {
      const response = await fetch('/api/admin/algorithms', {
        method: 'POST',
        body: JSON.stringify(algorithmData)
      })
      const newAlgorithm = await response.json()
      algorithms.value.push(newAlgorithm)
      await logHistory('create', 'algorithm', newAlgorithm.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateAlgorithm(algorithmId, algorithmData) {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/algorithms/${algorithmId}`, {
        method: 'PUT',
        body: JSON.stringify(algorithmData)
      })
      const updated = await response.json()
      const index = algorithms.value.findIndex(a => a.id === algorithmId)
      if (index !== -1) {
        algorithms.value[index] = updated
      }
      await logHistory('update', 'algorithm', updated.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deleteAlgorithm(algorithmId) {
    loading.value = true
    try {
      const algorithm = algorithms.value.find(a => a.id === algorithmId)
      await fetch(`/api/admin/algorithms/${algorithmId}`, {
        method: 'DELETE'
      })
      algorithms.value = algorithms.value.filter(a => a.id !== algorithmId)
      await logHistory('delete', 'algorithm', algorithm.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function toggleAlgorithm(algorithmId) {
    const algorithm = algorithms.value.find(a => a.id === algorithmId)
    if (algorithm) {
      algorithm.active = !algorithm.active
      await updateAlgorithm(algorithmId, algorithm)
    }
  }

  async function createFactor(factorData) {
    loading.value = true
    try {
      const response = await fetch('/api/admin/factors', {
        method: 'POST',
        body: JSON.stringify(factorData)
      })
      const newFactor = await response.json()
      factors.value.push(newFactor)
      await logHistory('create', 'factor', newFactor.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateFactor(factorId, factorData) {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/factors/${factorId}`, {
        method: 'PUT',
        body: JSON.stringify(factorData)
      })
      const updated = await response.json()
      const index = factors.value.findIndex(f => f.id === factorId)
      if (index !== -1) {
        factors.value[index] = updated
      }
      await logHistory('update', 'factor', updated.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deleteFactor(factorId) {
    loading.value = true
    try {
      const factor = factors.value.find(f => f.id === factorId)
      await fetch(`/api/admin/factors/${factorId}`, {
        method: 'DELETE'
      })
      factors.value = factors.value.filter(f => f.id !== factorId)
      await logHistory('delete', 'factor', factor.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createRule(ruleData) {
    loading.value = true
    try {
      const response = await fetch('/api/admin/rules', {
        method: 'POST',
        body: JSON.stringify(ruleData)
      })
      const newRule = await response.json()
      rules.value.push(newRule)
      await logHistory('create', 'rule', newRule.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateRule(ruleId, ruleData) {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/rules/${ruleId}`, {
        method: 'PUT',
        body: JSON.stringify(ruleData)
      })
      const updated = await response.json()
      const index = rules.value.findIndex(r => r.id === ruleId)
      if (index !== -1) {
        rules.value[index] = updated
      }
      await logHistory('update', 'rule', updated.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deleteRule(ruleId) {
    loading.value = true
    try {
      const rule = rules.value.find(r => r.id === ruleId)
      await fetch(`/api/admin/rules/${ruleId}`, {
        method: 'DELETE'
      })
      rules.value = rules.value.filter(r => r.id !== ruleId)
      await logHistory('delete', 'rule', rule.name)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function logHistory(action, type, name) {
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: {
        name: 'Администратор',
        id: 1
      },
      action,
      type,
      name,
      details: `${action} ${type}: ${name}`
    }
    algorithmHistory.value.unshift(historyEntry)
    
    // Сохраняем в API
    await fetch('/api/admin/history', {
      method: 'POST',
      body: JSON.stringify(historyEntry)
    })
  }

  // Применить алгоритм к пользователю
  async function applyAlgorithmToUser(userId, algorithmId, workoutData) {
    loading.value = true
    try {
      const algorithm = algorithms.value.find(a => a.id === algorithmId)
      const enabledFactorsList = enabledFactors.value
      const activeRulesList = activeRules.value
      
      const response = await fetch(`/api/users/${userId}/apply-algorithm`, {
        method: 'POST',
        body: JSON.stringify({
          algorithm,
          factors: enabledFactorsList,
          rules: activeRulesList,
          workoutData
        })
      })
      
      return await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // Состояние
    algorithms,
    factors,
    rules,
    currentAlgorithm,
    algorithmHistory,
    loading,
    error,
    // Геттеры
    activeAlgorithms,
    enabledFactors,
    activeRules,
    // Действия
    fetchAlgorithms,
    fetchFactors,
    fetchRules,
    fetchAlgorithmHistory,
    createAlgorithm,
    updateAlgorithm,
    deleteAlgorithm,
    toggleAlgorithm,
    createFactor,
    updateFactor,
    deleteFactor,
    createRule,
    updateRule,
    deleteRule,
    applyAlgorithmToUser,
    logHistory
  }
})