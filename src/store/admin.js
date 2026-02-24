import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    algorithms: [],
    factors: [],
    rules: [],
    history: []
  }),
  actions: {
    async loadAlgorithms() {
      this.algorithms = [
        {
          id: 1,
          name: 'Прогрессивная нагрузка',
          description: 'Постепенное увеличение нагрузки с заданным процентом',
          active: true,
          params: {
            increase: 10,
            period: 'weekly',
            maxIncrease: 50
          }
        },
        {
          id: 2,
          name: 'Адаптивная нагрузка',
          description: 'Адаптация нагрузки на основе предыдущих результатов',
          active: true,
          params: {
            sensitivity: 0.8,
            maxIncrease: 15,
            minDecrease: 5
          }
        },
        {
          id: 3,
          name: 'Периодическая нагрузка',
          description: 'Циклическое изменение нагрузки по неделям',
          active: false,
          params: {
            cycles: 4,
            peakWeek: 3,
            recoveryWeek: 4
          }
        }
      ]
    },
    async loadFactors() {
      this.factors = [
        {
          id: 1,
          name: 'Усталость',
          description: 'Уровень физической усталости пользователя',
          icon: 'fas fa-battery-quarter',
          color: '#FF9800',
          weight: 0.3,
          minValue: 0,
          maxValue: 100,
          formula: 'linear',
          enabled: true
        },
        {
          id: 2,
          name: 'Сон',
          description: 'Качество и продолжительность сна',
          icon: 'fas fa-moon',
          color: '#4A90E2',
          weight: 0.2,
          minValue: 0,
          maxValue: 10,
          formula: 'exponential',
          enabled: true
        },
        {
          id: 3,
          name: 'Питание',
          description: 'Качество питания и калорийность',
          icon: 'fas fa-utensils',
          color: '#4CAF50',
          weight: 0.2,
          minValue: 0,
          maxValue: 100,
          formula: 'linear',
          enabled: true
        }
      ]
    },
    async loadRules() {
      this.rules = [
        {
          id: 1,
          name: 'Пропуск тренировки',
          description: 'Снижение нагрузки при пропуске',
          condition: 'missedWorkouts > 2',
          action: 'decreaseLoad(15%)',
          active: true
        },
        {
          id: 2,
          name: 'Успешное выполнение',
          description: 'Увеличение нагрузки при успехе',
          condition: 'completedWorkouts > 3',
          action: 'increaseLoad(10%)',
          active: true
        }
      ]
    },
    async loadHistory() {
      this.history = [
        {
          id: 1,
          timestamp: new Date('2024-01-20T10:30:00'),
          user: {
            name: 'Администратор',
            avatar: 'https://via.placeholder.com/30'
          },
          action: 'Изменение алгоритма',
          details: 'Прогрессивная нагрузка: параметр increase изменен с 10 на 12'
        },
        {
          id: 2,
          timestamp: new Date('2024-01-19T15:45:00'),
          user: {
            name: 'Администратор',
            avatar: 'https://via.placeholder.com/30'
          },
          action: 'Добавление фактора',
          details: 'Добавлен фактор "Стресс" с весом 0.15'
        }
      ]
    },
    async addAlgorithm(algorithm) {
      this.algorithms.push(algorithm)
      this.saveToHistory('Добавление алгоритма', `Добавлен алгоритм "${algorithm.name}"`)
    },
    async updateAlgorithm(algorithm) {
      const index = this.algorithms.findIndex(a => a.id === algorithm.id)
      if (index !== -1) {
        this.algorithms[index] = algorithm
        this.saveToHistory('Редактирование алгоритма', `Отредактирован алгоритм "${algorithm.name}"`)
      }
    },
    async toggleAlgorithm(algorithm) {
      algorithm.active = !algorithm.active
      this.updateAlgorithm(algorithm)
    },
    async deleteAlgorithm(algorithm) {
      this.algorithms = this.algorithms.filter(a => a.id !== algorithm.id)
      this.saveToHistory('Удаление алгоритма', `Удален алгоритм "${algorithm.name}"`)
    },
    async addFactor(factor) {
      this.factors.push(factor)
      this.saveToHistory('Добавление фактора', `Добавлен фактор "${factor.name}"`)
    },
    async updateFactor(factor) {
      const index = this.factors.findIndex(f => f.id === factor.id)
      if (index !== -1) {
        this.factors[index] = factor
        this.saveToHistory('Обновление фактора', `Обновлен фактор "${factor.name}"`)
      }
    },
    async deleteFactor(factor) {
      this.factors = this.factors.filter(f => f.id !== factor.id)
      this.saveToHistory('Удаление фактора', `Удален фактор "${factor.name}"`)
    },
    async addRule(rule) {
      this.rules.push(rule)
      this.saveToHistory('Добавление правила', `Добавлено правило "${rule.name}"`)
    },
    async updateRule(rule) {
      const index = this.rules.findIndex(r => r.id === rule.id)
      if (index !== -1) {
        this.rules[index] = rule
        this.saveToHistory('Редактирование правила', `Отредактировано правило "${rule.name}"`)
      }
    },
    async toggleRule(rule) {
      rule.active = !rule.active
      this.updateRule(rule)
    },
    async deleteRule(rule) {
      this.rules = this.rules.filter(r => r.id !== rule.id)
      this.saveToHistory('Удаление правила', `Удалено правило "${rule.name}"`)
    },
    saveToHistory(action, details) {
      this.history.unshift({
        id: Date.now(),
        timestamp: new Date(),
        user: {
          name: 'Администратор',
          avatar: 'https://via.placeholder.com/30'
        },
        action,
        details
      })
    }
  }
})
