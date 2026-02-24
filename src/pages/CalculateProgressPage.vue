<template>
  <div class="workout-load-calculator">
    <div class="calculator-header">
      <h2>Расчет нагрузки на тренировку</h2>
      <p class="subtitle">На основе ваших прошлых результатов</p>
    </div>

    <!-- Статистика пользователя -->
    <div class="user-stats">
      <div class="stat-card">
        <i class="fas fa-chart-line"></i>
        <div class="stat-info">
          <span class="stat-label">Средняя нагрузка</span>
          <span class="stat-value">{{ userStats.avgLoad }} кг</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-heart"></i>
        <div class="stat-info">
          <span class="stat-label">Средний пульс</span>
          <span class="stat-value">{{ userStats.avgHeartRate }} уд/мин</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-bolt"></i>
        <div class="stat-info">
          <span class="stat-label">Интенсивность</span>
          <span class="stat-value">{{ userStats.intensity }}%</span>
        </div>
      </div>
    </div>

    <!-- Варианты нагрузки -->
    <div class="load-options">
      <h3>Рекомендованные варианты нагрузки</h3>
      <div class="options-grid">
        <div 
          v-for="option in loadOptions" 
          :key="option.id"
          class="option-card"
          :class="{ selected: selectedOption === option.id }"
          @click="selectOption(option.id)"
        >
          <div class="option-header" :style="{ backgroundColor: option.color + '20' }">
            <i :class="option.icon" :style="{ color: option.color }"></i>
            <span class="option-type">{{ option.type }}</span>
          </div>
          
          <div class="option-content">
            <div class="load-indicator">
              <div class="load-bar">
                <div class="load-fill" :style="{ width: option.loadPercentage + '%', backgroundColor: option.color }"></div>
              </div>
              <span class="load-value">{{ option.loadPercentage }}% нагрузки</span>
            </div>

            <div class="exercise-list">
              <div v-for="exercise in option.exercises" :key="exercise.name" class="exercise-item">
                <span class="exercise-name">{{ exercise.name }}</span>
                <div class="exercise-details">
                  <span>{{ exercise.sets }}x{{ exercise.reps }}</span>
                  <span>{{ exercise.weight }} кг</span>
                </div>
              </div>
            </div>

            <div class="option-meta">
              <span><i class="far fa-clock"></i> {{ option.duration }} мин</span>
              <span><i class="far fa-fire"></i> {{ option.calories }} ккал</span>
              <span><i class="fas fa-chart-bar"></i> {{ option.difficulty }}</span>
            </div>

            <div class="option-reason">
              <i class="fas fa-info-circle"></i>
              <span>{{ option.reason }}</span>
            </div>
          </div>

          <button class="btn btn-primary" @click.stop="selectAndStart(option.id)">
            Выбрать этот вариант
          </button>
        </div>
      </div>
    </div>

    <!-- Дополнительные настройки для тренера -->
    <div v-if="isTrainer" class="trainer-controls">
      <h3>Настройки расчета для тренера</h3>
      
      <div class="calculation-settings">
        <div class="setting-group">
          <label>Алгоритм расчета</label>
          <select v-model="selectedAlgorithm" @change="updateAlgorithm">
            <option v-for="algo in algorithms" :key="algo.id" :value="algo.id">
              {{ algo.name }}
            </option>
          </select>
        </div>

        <div class="setting-group">
          <label>Учитывать факторы</label>
          <div class="checkbox-group">
            <label v-for="factor in factors" :key="factor.id">
              <input type="checkbox" v-model="factor.enabled" @change="updateFactors">
              {{ factor.name }}
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>Количество вариантов</label>
          <input type="number" v-model="optionsCount" min="1" max="5" @change="updateOptionsCount">
        </div>
      </div>

      <button class="btn btn-secondary" @click="recalculateForUser">
        <i class="fas fa-sync-alt"></i> Пересчитать для пользователя
      </button>
    </div>

    <!-- Отметка о выполнении -->
    <div v-if="selectedOption" class="completion-section">
      <h3>Отметка о выполнении тренировки</h3>
      
      <div class="completion-form">
        <div class="form-group">
          <label>Фактическое время тренировки</label>
          <input type="number" v-model="completionData.actualDuration" placeholder="минут">
        </div>

        <div class="form-group">
          <label>Средний пульс</label>
          <input type="number" v-model="completionData.avgHeartRate" placeholder="уд/мин">
        </div>

        <div class="form-group">
          <label>Самочувствие</label>
          <div class="rating">
            <button 
              v-for="n in 5" 
              :key="n"
              class="rating-btn"
              :class="{ active: completionData.wellbeing >= n }"
              @click="completionData.wellbeing = n"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Комментарий</label>
          <textarea v-model="completionData.comment" placeholder="Ваши впечатления от тренировки..."></textarea>
        </div>

        <button class="btn btn-success btn-large" @click="markAsCompleted">
          <i class="fas fa-check-circle"></i> Отметить выполнение
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
  isTrainer: {
    type: Boolean,
    default: false
  },
  workoutType: {
    type: String,
    default: 'strength'
  }
})

const emit = defineEmits(['optionSelected', 'workoutCompleted'])

const store = useStore()
const route = useRoute()

const selectedOption = ref(null)
const selectedAlgorithm = ref('progressive')
const optionsCount = ref(3)
const algorithms = ref([])
const factors = ref([])

// Статистика пользователя
const userStats = ref({
  avgLoad: 45.5,
  avgHeartRate: 145,
  intensity: 78,
  previousWorkouts: [
    { date: '2024-01-15', load: 40, heartRate: 140, intensity: 70 },
    { date: '2024-01-17', load: 42, heartRate: 142, intensity: 72 },
    { date: '2024-01-19', load: 45, heartRate: 145, intensity: 75 },
    { date: '2024-01-21', load: 48, heartRate: 148, intensity: 78 }
  ]
})

// Варианты нагрузки
const loadOptions = ref([])

// Данные о выполнении
const completionData = ref({
  actualDuration: null,
  avgHeartRate: null,
  wellbeing: 3,
  comment: ''
})

// Загрузка алгоритмов из админки
const loadAlgorithms = async () => {
  try {
    // В реальном приложении здесь будет API запрос
    algorithms.value = [
      { id: 'progressive', name: 'Прогрессивная нагрузка', params: { increase: 10, period: 'weekly' } },
      { id: 'adaptive', name: 'Адаптивная нагрузка', params: { sensitivity: 0.8, maxIncrease: 15 } },
      { id: 'periodic', name: 'Периодическая нагрузка', params: { cycles: 4, peakWeek: 3 } },
      { id: 'volumeBased', name: 'На основе объема', params: { volumeFactor: 1.2, intensityFactor: 0.8 } }
    ]
  } catch (error) {
    console.error('Error loading algorithms:', error)
  }
}

// Загрузка факторов из админки
const loadFactors = async () => {
  try {
    factors.value = [
      { id: 'fatigue', name: 'Уровень усталости', enabled: true, weight: 0.3 },
      { id: 'sleep', name: 'Качество сна', enabled: true, weight: 0.2 },
      { id: 'nutrition', name: 'Питание', enabled: true, weight: 0.2 },
      { id: 'stress', name: 'Уровень стресса', enabled: false, weight: 0.15 },
      { id: 'injury', name: 'Травмы', enabled: true, weight: 0.15 }
    ]
  } catch (error) {
    console.error('Error loading factors:', error)
  }
}

// Расчет вариантов нагрузки
const calculateLoadOptions = async () => {
  try {
    // В реальном приложении здесь будет API запрос к алгоритму
    const algorithm = algorithms.value.find(a => a.id === selectedAlgorithm.value)
    const enabledFactors = factors.value.filter(f => f.enabled)
    
    // Симуляция расчета вариантов
    loadOptions.value = [
      {
        id: 1,
        type: 'Стандартный',
        icon: 'fas fa-chart-line',
        color: '#4CAF50',
        loadPercentage: 100,
        duration: 45,
        calories: 350,
        difficulty: 'Средний',
        reason: 'Соответствует вашему среднему уровню',
        exercises: [
          { name: 'Жим лежа', sets: 3, reps: 10, weight: 50 },
          { name: 'Приседания', sets: 3, reps: 12, weight: 60 },
          { name: 'Тяга верхнего блока', sets: 3, reps: 10, weight: 45 }
        ]
      },
      {
        id: 2,
        type: 'Прогрессивный',
        icon: 'fas fa-arrow-up',
        color: '#2196F3',
        loadPercentage: 110,
        duration: 50,
        calories: 400,
        difficulty: 'Выше среднего',
        reason: 'Увеличение нагрузки на 10% для прогресса',
        exercises: [
          { name: 'Жим лежа', sets: 4, reps: 8, weight: 55 },
          { name: 'Приседания', sets: 4, reps: 10, weight: 65 },
          { name: 'Тяга верхнего блока', sets: 4, reps: 8, weight: 50 }
        ]
      },
      {
        id: 3,
        type: 'Восстановительный',
        icon: 'fas fa-heart',
        color: '#FF9800',
        loadPercentage: 80,
        duration: 35,
        calories: 280,
        difficulty: 'Легкий',
        reason: 'Рекомендуется для восстановления',
        exercises: [
          { name: 'Жим лежа', sets: 2, reps: 12, weight: 40 },
          { name: 'Приседания', sets: 2, reps: 15, weight: 50 },
          { name: 'Тяга верхнего блока', sets: 2, reps: 12, weight: 35 }
        ]
      }
    ]
    
    // Применяем выбранный алгоритм
    applyAlgorithm(algorithm, enabledFactors)
  } catch (error) {
    console.error('Error calculating load options:', error)
  }
}

// Применение алгоритма
const applyAlgorithm = (algorithm, factors) => {
  // Здесь будет логика применения алгоритма
  console.log('Applying algorithm:', algorithm, 'with factors:', factors)
  
  // Модифицируем варианты на основе алгоритма
  loadOptions.value = loadOptions.value.map((option, index) => {
    if (algorithm.id === 'progressive') {
      option.loadPercentage += algorithm.params.increase
      option.reason = `Прогрессивное увеличение на ${algorithm.params.increase}%`
    } else if (algorithm.id === 'adaptive') {
      // Адаптивная логика
    }
    return option
  })
}

// Выбор варианта
const selectOption = (optionId) => {
  selectedOption.value = optionId
  emit('optionSelected', loadOptions.value.find(o => o.id === optionId))
}

// Выбор и старт тренировки
const selectAndStart = (optionId) => {
  selectOption(optionId)
  // Логика старта тренировки
}

// Отметка о выполнении
const markAsCompleted = async () => {
  try {
    const selectedWorkout = loadOptions.value.find(o => o.id === selectedOption.value)
    
    const completionPayload = {
      userId: props.userId,
      workoutId: selectedWorkout.id,
      plannedData: selectedWorkout,
      actualData: completionData.value,
      timestamp: new Date().toISOString()
    }
    
    // Отправка данных на сервер
    await store.dispatch('workouts/markAsCompleted', completionPayload)
    
    // Обновление статистики пользователя
    updateUserStats(completionPayload)
    
    emit('workoutCompleted', completionPayload)
    
    // Сброс формы
    completionData.value = {
      actualDuration: null,
      avgHeartRate: null,
      wellbeing: 3,
      comment: '',
      exercisesCompleted: []
    }
    
    // Пересчет вариантов для следующей тренировки
    await calculateLoadOptions()
    
  } catch (error) {
    console.error('Error marking workout as completed:', error)
  }
}

// Обновление статистики пользователя
const updateUserStats = (completionData) => {
  // Логика обновления статистики на основе выполненной тренировки
  const newLoad = completionData.actualData.avgHeartRate || userStats.value.avgLoad
  userStats.value.avgLoad = (userStats.value.avgLoad + newLoad) / 2
}

// Методы для тренера
const updateAlgorithm = () => {
  calculateLoadOptions()
}

const updateFactors = () => {
  calculateLoadOptions()
}

const updateOptionsCount = () => {
  // Обновление количества вариантов
  calculateLoadOptions()
}

const recalculateForUser = () => {
  calculateLoadOptions()
}

// Наблюдатель за изменениями
watch(() => props.userId, () => {
  calculateLoadOptions()
})

watch(() => props.workoutType, () => {
  calculateLoadOptions()
})

// Инициализация
onMounted(async () => {
  await loadAlgorithms()
  await loadFactors()
  await calculateLoadOptions()
})
</script>

<style scoped>
.workout-load-calculator {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-header {
  text-align: center;
  margin-bottom: 30px;
}

.calculator-header h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card i {
  font-size: 24px;
  color: #667eea;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.option-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.option-card.selected {
  border-color: #667eea;
}

.option-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-header i {
  font-size: 24px;
}

.option-type {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.option-content {
  padding: 20px;
}

.load-indicator {
  margin-bottom: 20px;
}

.load-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 5px;
  overflow: hidden;
}

.load-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.load-value {
  font-size: 12px;
  color: #666;
}

.exercise-list {
  margin-bottom: 20px;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.exercise-name {
  color: #333;
  font-weight: 500;
}

.exercise-details {
  color: #666;
  font-size: 14px;
}

.exercise-details span {
  margin-left: 10px;
}

.option-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.option-meta i {
  margin-right: 5px;
}

.option-reason {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.option-reason i {
  color: #667eea;
}

.trainer-controls {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.trainer-controls h3 {
  margin-bottom: 20px;
  color: #333;
}

.calculation-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-group label {
  font-weight: 500;
  color: #555;
}

.setting-group select,
.setting-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.completion-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.completion-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.completion-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.rating {
  display: flex;
  gap: 10px;
}

.rating-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background: white;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-btn:hover,
.rating-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-success {
  background: #4CAF50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-block {
  width: 100%;
}

.btn-large {
  padding: 15px 30px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .user-stats {
    grid-template-columns: 1fr;
  }
  
  .calculation-settings {
    grid-template-columns: 1fr;
  }
}
</style>