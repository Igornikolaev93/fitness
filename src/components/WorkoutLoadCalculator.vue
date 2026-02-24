<template>
  <div class="workout-load-calculator">
    <div class="calculator-header">
      <h2>Расчет нагрузки на тренировку</h2>
      <p class="subtitle">На основе ваших прошлых результатов</p>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="algorithmStore.loading || workoutStore.loading || userStore.loading" class="loading-overlay">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Загрузка...</span>
    </div>

    <!-- Статистика пользователя -->
    <div class="user-stats">
      <div class="stat-card">
        <i class="fas fa-chart-line"></i>
        <div class="stat-info">
          <span class="stat-label">Средняя нагрузка</span>
          <span class="stat-value">{{ userStore.userStats.avgLoad }} кг</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-heart"></i>
        <div class="stat-info">
          <span class="stat-label">Средний пульс</span>
          <span class="stat-value">{{ userStore.userStats.avgHeartRate }} уд/мин</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-bolt"></i>
        <div class="stat-info">
          <span class="stat-label">Интенсивность</span>
          <span class="stat-value">{{ userStore.userStats.intensity }}%</span>
        </div>
      </div>
    </div>

    <!-- Варианты нагрузки -->
    <div class="load-options">
      <h3>Рекомендованные варианты нагрузки</h3>
      <div v-if="workoutStore.workoutOptions.length === 0" class="no-options">
        <p>Нет доступных вариантов. Пожалуйста, попробуйте позже.</p>
      </div>
      <div v-else class="options-grid">
        <div 
          v-for="option in workoutStore.workoutOptions" 
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
          <select v-model="selectedAlgorithmId" @change="updateAlgorithm">
            <option v-for="algo in algorithmStore.activeAlgorithms" :key="algo.id" :value="algo.id">
              {{ algo.name }}
            </option>
          </select>
        </div>

        <div class="setting-group">
          <label>Учитывать факторы</label>
          <div class="checkbox-group">
            <label v-for="factor in algorithmStore.factors" :key="factor.id">
              <input 
                type="checkbox" 
                v-model="factor.enabled" 
                @change="updateFactor(factor)"
              >
              {{ factor.name }}
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>Количество вариантов</label>
          <input type="number" v-model="optionsCount" min="1" max="5" @change="recalculateOptions">
        </div>
      </div>

      <button class="btn btn-secondary" @click="recalculateForUser" :disabled="algorithmStore.loading">
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': algorithmStore.loading }"></i> 
        Пересчитать для пользователя
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

        <button class="btn btn-success btn-large" @click="markAsCompleted" :disabled="workoutStore.loading">
          <i class="fas fa-check-circle"></i> Отметить выполнение
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useWorkoutStore } from '@/store/workout'
import { useAlgorithmStore } from '@/store/algorithm'
import { useUserStore } from '@/store/user'

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

const workoutStore = useWorkoutStore()
const algorithmStore = useAlgorithmStore()
const userStore = useUserStore()

const selectedOption = ref(null)
const selectedAlgorithmId = ref(null)
const optionsCount = ref(3)

// Данные о выполнении
const completionData = reactive({
  actualDuration: null,
  avgHeartRate: null,
  wellbeing: 3,
  comment: '',
  exercisesCompleted: []
})

// Вычисляемые свойства
const selectedAlgorithm = computed(() => {
  return algorithmStore.algorithms.find(a => a.id === selectedAlgorithmId.value)
})

// Методы
const selectOption = (optionId) => {
  selectedOption.value = optionId
  workoutStore.selectWorkoutOption(optionId)
  emit('optionSelected', workoutStore.workoutOptions.find(o => o.id === optionId))
}

const selectAndStart = async (optionId) => {
  selectOption(optionId)
  await workoutStore.startWorkout(optionId)
}

const markAsCompleted = async () => {
  const selectedWorkout = workoutStore.workoutOptions.find(o => o.id === selectedOption.value)
  
  await workoutStore.completeWorkout(selectedWorkout.id, {
    ...completionData,
    plannedWorkout: selectedWorkout
  })
  
  emit('workoutCompleted', {
    workoutId: selectedWorkout.id,
    completionData
  })
  
  // Сброс формы
  completionData.actualDuration = null
  completionData.avgHeartRate = null
  completionData.wellbeing = 3
  completionData.comment = ''
  
  // Пересчет вариантов
  await recalculateOptions()
}

const updateAlgorithm = async () => {
  await recalculateOptions()
}

const updateFactor = async (factor) => {
  await algorithmStore.updateFactor(factor.id, factor)
  await recalculateOptions()
}

const recalculateOptions = async () => {
  await workoutStore.calculateWorkoutOptions(props.userId, props.workoutType)
}

const recalculateForUser = async () => {
  await algorithmStore.applyAlgorithmToUser(
    props.userId,
    selectedAlgorithmId.value,
    { type: props.workoutType }
  )
  await recalculateOptions()
}

// Наблюдатели
watch(() => props.userId, async (newUserId) => {
  if (newUserId) {
    await userStore.fetchUserStats(newUserId)
    await recalculateOptions()
  }
})

watch(() => props.workoutType, async () => {
  await recalculateOptions()
})

// Инициализация
onMounted(async () => {
  await algorithmStore.fetchAlgorithms()
  await algorithmStore.fetchFactors()
  
  if (algorithmStore.activeAlgorithms.length > 0) {
    selectedAlgorithmId.value = algorithmStore.activeAlgorithms[0].id
  }
  
  if (props.userId) {
    await userStore.fetchUserStats(props.userId)
    await recalculateOptions()
  }
})
</script>

<style scoped>
.workout-load-calculator {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-overlay i {
  font-size: 24px;
  color: #667eea;
  margin-right: 10px;
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

.btn-success:hover:not(:disabled) {
  background: #45a049;
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.btn-large {
  padding: 15px 30px;
  font-size: 16px;
}

.no-options {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 12px;
  color: #666;
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