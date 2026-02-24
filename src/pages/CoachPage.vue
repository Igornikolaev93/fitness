<template>
  <div class="trainer-dashboard">
    <div class="trainer-header">
      <h1>Личный кабинет тренера</h1>
      <p class="subtitle">Управление тренировками и прогрессом учеников</p>
    </div>

    <!-- Краткая статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalClients }}</span>
          <span class="stat-label">Всего учеников</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-calendar-check"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.todayWorkouts }}</span>
          <span class="stat-label">Тренировок сегодня</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-chart-line"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.avgProgress }}%</span>
          <span class="stat-label">Средний прогресс</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-clock"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.hoursThisWeek }}</span>
          <span class="stat-label">Часов за неделю</span>
        </div>
      </div>
    </div>

    <!-- Вкладки -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn" 
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </button>
    </div>

    <!-- Список учеников -->
    <div v-if="activeTab === 'clients'" class="clients-section">
      <div class="section-header">
        <h2>Мои ученики</h2>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="clientSearch" placeholder="Поиск ученика...">
        </div>
      </div>

      <div class="clients-grid">
        <div v-for="client in filteredClients" :key="client.id" class="client-card" @click="selectClient(client)">
          <div class="client-avatar">
            <img :src="client.avatar" :alt="client.name">
            <span class="client-status" :class="client.status"></span>
          </div>
          <div class="client-info">
            <h3>{{ client.name }}</h3>
            <p class="client-age">{{ client.age }} лет</p>
            <div class="client-progress">
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: client.progress + '%' }"></div>
              </div>
              <span class="progress-value">{{ client.progress }}%</span>
            </div>
            <div class="client-meta">
              <span><i class="fas fa-dumbbell"></i> {{ client.workoutsCount }} тренировок</span>
              <span><i class="fas fa-calendar"></i> С {{ client.startDate }}</span>
            </div>
          </div>
          <button class="btn btn-outline" @click.stop="openWorkoutPlanner(client)">
            <i class="fas fa-plus"></i> План
          </button>
        </div>
      </div>
    </div>

    <!-- Расписание -->
    <div v-if="activeTab === 'schedule'" class="schedule-section">
      <h2>Расписание тренировок</h2>
      
      <div class="schedule-calendar">
        <div class="calendar-header">
          <button class="btn btn-outline" @click="prevWeek">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="current-week">{{ currentWeekRange }}</span>
          <button class="btn btn-outline" @click="nextWeek">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="schedule-grid">
          <div v-for="day in schedule" :key="day.date" class="schedule-day">
            <div class="day-header">
              <span class="day-name">{{ day.name }}</span>
              <span class="day-date">{{ day.date }}</span>
            </div>
            <div class="day-workouts">
              <div v-for="workout in day.workouts" :key="workout.id" class="schedule-workout">
                <span class="workout-time">{{ workout.time }}</span>
                <span class="workout-client">{{ workout.client }}</span>
                <span class="workout-type" :class="workout.type">{{ workout.type }}</span>
              </div>
              <div v-if="!day.workouts.length" class="no-workouts">
                Нет тренировок
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Планировщик тренировок для выбранного ученика -->
    <div v-if="selectedClient" class="workout-planner-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Планирование тренировки для {{ selectedClient.name }}</h3>
          <button class="close-btn" @click="selectedClient = null">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Компонент расчета нагрузки -->
          <WorkoutLoadCalculator 
            :user-id="selectedClient.id"
            :is-trainer="true"
            @optionSelected="handleOptionSelected"
            @workoutCompleted="handleWorkoutCompleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkoutLoadCalculator from '@/components/WorkoutLoadCalculator.vue'

const activeTab = ref('clients')
const clientSearch = ref('')
const selectedClient = ref(null)

// Статистика
const stats = ref({
  totalClients: 12,
  todayWorkouts: 4,
  avgProgress: 78,
  hoursThisWeek: 24
})

// Вкладки
const tabs = ref([
  { id: 'clients', name: 'Ученики', icon: 'fas fa-users' },
  { id: 'schedule', name: 'Расписание', icon: 'fas fa-calendar' },
  { id: 'analytics', name: 'Аналитика', icon: 'fas fa-chart-bar' }
])

// Список учеников
const clients = ref([
  {
    id: 1,
    name: 'Анна Смирнова',
    avatar: 'https://via.placeholder.com/100',
    age: 28,
    status: 'active',
    progress: 75,
    workoutsCount: 24,
    startDate: '01.2024',
    lastWorkout: '2024-01-20',
    goals: ['Снижение веса', 'Укрепление мышц']
  },
  {
    id: 2,
    name: 'Иван Петров',
    avatar: 'https://via.placeholder.com/100',
    age: 32,
    status: 'active',
    progress: 60,
    workoutsCount: 18,
    startDate: '02.2024',
    lastWorkout: '2024-01-19',
    goals: ['Набор массы', 'Силовые показатели']
  },
  {
    id: 3,
    name: 'Елена Иванова',
    avatar: 'https://via.placeholder.com/100',
    age: 25,
    status: 'inactive',
    progress: 45,
    workoutsCount: 12,
    startDate: '03.2024',
    lastWorkout: '2024-01-10',
    goals: ['Тонус', 'Выносливость']
  }
])

// Фильтрация учеников
const filteredClients = computed(() => {
  if (!clientSearch.value) return clients.value
  return clients.value.filter(client => 
    client.name.toLowerCase().includes(clientSearch.value.toLowerCase())
  )
})

// Расписание
const schedule = ref([
  {
    name: 'Понедельник',
    date: '22.01',
    workouts: [
      { id: 1, time: '10:00', client: 'Анна Смирнова', type: 'силовая' },
      { id: 2, time: '12:00', client: 'Иван Петров', type: 'кардио' }
    ]
  },
  {
    name: 'Вторник',
    date: '23.01',
    workouts: [
      { id: 3, time: '11:00', client: 'Елена Иванова', type: 'йога' }
    ]
  },
  {
    name: 'Среда',
    date: '24.01',
    workouts: [
      { id: 4, time: '09:00', client: 'Анна Смирнова', type: 'силовая' },
      { id: 5, time: '14:00', client: 'Иван Петров', type: 'силовая' }
    ]
  },
  {
    name: 'Четверг',
    date: '25.01',
    workouts: []
  },
  {
    name: 'Пятница',
    date: '26.01',
    workouts: [
      { id: 6, time: '16:00', client: 'Елена Иванова', type: 'кардио' }
    ]
  }
])

// Методы
const selectClient = (client) => {
  selectedClient.value = client
}

const openWorkoutPlanner = (client) => {
  selectedClient.value = client
}

const handleOptionSelected = (option) => {
  console.log('Selected workout option:', option)
  // Логика сохранения выбранного варианта
}

const handleWorkoutCompleted = (completionData) => {
  console.log('Workout completed:', completionData)
  // Логика обработки выполненной тренировки
}

const prevWeek = () => {
  // Логика переключения на предыдущую неделю
}

const nextWeek = () => {
  // Логика переключения на следующую неделю
}

const currentWeekRange = computed(() => {
  return '22 - 28 января 2024'
})
</script>

<style scoped>
.trainer-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.trainer-header {
  margin-bottom: 30px;
}

.trainer-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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
  width: 50px;
  height: 50px;
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

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab-btn i {
  font-size: 18px;
}

.tab-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.tab-btn.active {
  background: #667eea;
  color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  color: #333;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.client-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.client-avatar {
  position: relative;
  width: 70px;
  height: 70px;
}

.client-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.client-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.client-status.active {
  background: #4CAF50;
}

.client-status.inactive {
  background: #f44336;
}

.client-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333;
}

.client-age {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.client-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-bar-container {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 12px;
  font-weight: 500;
  color: #667eea;
}

.client-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

.client-meta i {
  margin-right: 3px;
}

.schedule-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.schedule-calendar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-week {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.schedule-day {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  background: #667eea;
  color: white;
  padding: 10px;
  text-align: center;
}

.day-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
}

.day-date {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.day-workouts {
  padding: 10px;
  min-height: 150px;
}

.schedule-workout {
  background: white;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  border-left: 3px solid transparent;
}

.schedule-workout .workout-time {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.schedule-workout .workout-client {
  display: block;
  color: #666;
  margin-bottom: 3px;
}

.schedule-workout .workout-type {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  text-transform: uppercase;
}

.workout-type.силовая {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.workout-type.кардио {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.workout-type.йога {
  background: rgba(156, 39, 176, 0.1);
  color: #9C27B0;
}

.no-workouts {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 20px 0;
}

.workout-planner-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.workout-planner-modal .modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

@media (max-width: 768px) {
  .clients-grid {
    grid-template-columns: 1fr;
  }
  
  .client-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .client-avatar {
    margin: 0 auto;
  }
  
  .client-meta {
    justify-content: center;
  }
  
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  
  .search-box {
    width: 100%;
  }
  
  .section-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>