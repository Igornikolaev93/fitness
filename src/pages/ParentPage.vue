<template>
  <div class="parent-dashboard">
    <div class="dashboard-header">
      <h1>Личный кабинет родителя</h1>
      <p class="subtitle">Отслеживание прогресса и посещаемости вашего ребенка</p>
    </div>

    <!-- Информация о ребенке -->
    <div class="child-info-card">
      <div class="child-avatar">
        <img :src="child.avatar" :alt="child.name">
        <span class="child-status" :class="child.status"></span>
      </div>
      <div class="child-details">
        <h2>{{ child.name }}</h2>
        <p class="child-age">{{ child.age }} лет, {{ child.grade }} класс</p>
        <div class="child-contacts">
          <span><i class="fas fa-phone"></i> {{ child.phone }}</span>
          <span><i class="fas fa-envelope"></i> {{ child.email }}</span>
        </div>
      </div>
      <div class="child-stats">
        <div class="stat">
          <span class="stat-value">{{ child.stats.totalWorkouts }}</span>
          <span class="stat-label">Всего тренировок</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ child.stats.thisMonth }}</span>
          <span class="stat-label">За месяц</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ child.stats.streak }}</span>
          <span class="stat-label">Дней подряд</span>
        </div>
      </div>
    </div>

    <!-- Основная статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(76, 175, 80, 0.1)">
          <i class="fas fa-calendar-check" style="color: #4CAF50"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Посещаемость</span>
          <span class="stat-value">{{ attendance.percentage }}%</span>
          <span class="stat-detail">{{ attendance.visited }}/{{ attendance.total }} тренировок</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(33, 150, 243, 0.1)">
          <i class="fas fa-chart-line" style="color: #2196F3"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Прогресс</span>
          <span class="stat-value">{{ progress.percentage }}%</span>
          <span class="stat-detail">{{ progress.current }}/{{ progress.target }} целей</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(255, 152, 0, 0.1)">
          <i class="fas fa-trophy" style="color: #FF9800"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Достижения</span>
          <span class="stat-value">{{ achievements.unlocked }}</span>
          <span class="stat-detail">из {{ achievements.total }} получено</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(156, 39, 176, 0.1)">
          <i class="fas fa-clock" style="color: #9C27B0"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Время</span>
          <span class="stat-value">{{ totalTime.hours }}ч</span>
          <span class="stat-detail">{{ totalTime.minutes }} минут за месяц</span>
        </div>
      </div>
    </div>

    <!-- Графики прогресса -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Динамика посещаемости</h3>
        <canvas ref="attendanceChart"></canvas>
      </div>

      <div class="chart-container">
        <h3>Прогресс по месяцам</h3>
        <canvas ref="progressChart"></canvas>
      </div>
    </div>

    <!-- Календарь посещений -->
    <div class="attendance-section">
      <h3>Календарь посещений</h3>
      
      <div class="calendar-header">
        <button class="btn btn-outline" @click="prevMonth">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="current-month">{{ currentMonthName }} {{ currentYear }}</span>
        <button class="btn btn-outline" @click="nextMonth">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="calendar">
        <div class="calendar-weekdays">
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        <div class="calendar-days">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            class="calendar-day"
            :class="{
              'empty': !day.date,
              'attended': day.attended,
              'missed': day.missed,
              'planned': day.planned
            }"
          >
            <span class="day-number">{{ day.day }}</span>
            <div v-if="day.attended" class="day-status">
              <i class="fas fa-check-circle"></i>
            </div>
            <div v-else-if="day.missed" class="day-status">
              <i class="fas fa-times-circle"></i>
            </div>
            <div v-else-if="day.planned" class="day-status">
              <i class="fas fa-clock"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Последние тренировки -->
    <div class="recent-workouts">
      <h3>Последние тренировки</h3>
      
      <div class="workouts-list">
        <div v-for="workout in recentWorkouts" :key="workout.id" class="workout-item">
          <div class="workout-date">
            <span class="day">{{ formatDate(workout.date, 'DD') }}</span>
            <span class="month">{{ formatDate(workout.date, 'MMM') }}</span>
          </div>
          
          <div class="workout-info">
            <h4>{{ workout.title }}</h4>
            <div class="workout-meta">
              <span><i class="far fa-clock"></i> {{ workout.duration }} мин</span>
              <span><i class="far fa-fire"></i> {{ workout.calories }} ккал</span>
              <span class="workout-trainer">
                <i class="fas fa-user-tie"></i> {{ workout.trainer }}
              </span>
            </div>
          </div>

          <div class="workout-status" :class="workout.status">
            {{ workout.status === 'completed' ? 'Посетил' : 'Запланировано' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Детальный прогресс -->
    <div class="progress-details">
      <h3>Детальный прогресс</h3>

      <div class="progress-categories">
        <div v-for="category in progressCategories" :key="category.id" class="category-card">
          <div class="category-header">
            <i :class="category.icon" :style="{ color: category.color }"></i>
            <h4>{{ category.name }}</h4>
          </div>

          <div class="category-stats">
            <div class="category-stat">
              <span class="stat-label">Текущий уровень</span>
              <span class="stat-value">{{ category.currentLevel }}</span>
            </div>
            <div class="category-stat">
              <span class="stat-label">Следующий уровень</span>
              <span class="stat-value">{{ category.nextLevel }}</span>
            </div>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: category.progress + '%', backgroundColor: category.color }"></div>
          </div>

          <div class="category-details">
            <div v-for="detail in category.details" :key="detail.label" class="detail-item">
              <span class="detail-label">{{ detail.label }}</span>
              <span class="detail-value">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомления и рекомендации -->
    <div class="notifications-section">
      <h3>Уведомления и рекомендации</h3>

      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="notification.type">
          <div class="notification-icon">
            <i :class="notification.icon"></i>
          </div>
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <span class="notification-date">{{ formatDate(notification.date, 'relative') }}</span>
          </div>
          <button class="btn btn-outline" @click="markAsRead(notification.id)" v-if="!notification.read">
            Отметить
          </button>
        </div>
      </div>
    </div>

    <!-- Кнопка связи с тренером -->
    <div class="contact-trainer">
      <button class="btn btn-primary btn-large" @click="contactTrainer">
        <i class="fas fa-comments"></i> Связаться с тренером
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { ru } from 'date-fns/locale'

const store = useStore()
const attendanceChart = ref(null)
const progressChart = ref(null)

// Данные ребенка
const child = reactive({
  name: 'Иван Петров',
  avatar: 'https://via.placeholder.com/100',
  age: 12,
  grade: 6,
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  status: 'active',
  stats: {
    totalWorkouts: 48,
    thisMonth: 12,
    streak: 5
  }
})

// Статистика посещаемости
const attendance = reactive({
  percentage: 85,
  visited: 48,
  total: 56
})

// Прогресс
const progress = reactive({
  percentage: 70,
  current: 7,
  target: 10
})

// Достижения
const achievements = reactive({
  unlocked: 8,
  total: 15
})

// Общее время
const totalTime = reactive({
  hours: 42,
  minutes: 2520
})

// Данные для графиков
const attendanceData = ref({
  labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
  datasets: [{
    label: 'Посещаемость',
    data: [85, 78, 92, 88, 95, 82],
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
    borderWidth: 2,
    tension: 0.4
  }]
})

const progressData = ref({
  labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
  datasets: [
    {
      label: 'Сила',
      data: [65, 70, 75, 78, 82, 85],
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      borderColor: '#2196F3',
      borderWidth: 2,
      tension: 0.4
    },
    {
      label: 'Выносливость',
      data: [60, 65, 70, 72, 75, 80],
      backgroundColor: 'rgba(255, 152, 0, 0.2)',
      borderColor: '#FF9800',
      borderWidth: 2,
      tension: 0.4
    }
  ]
})

// Календарь
const currentDate = ref(new Date())
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const currentMonthName = computed(() => {
  return format(currentDate.value, 'LLLL', { locale: ru })
})

const currentYear = computed(() => {
  return format(currentDate.value, 'yyyy')
})

const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const days = eachDayOfInterval({ start, end })
  
  // Добавляем пустые ячейки для первого дня месяца
  const firstDayIndex = start.getDay() === 0 ? 6 : start.getDay() - 1
  const emptyDays = Array(firstDayIndex).fill({ date: null, day: '', attended: false, missed: false, planned: false })
  
  const daysWithStatus = days.map(date => {
    // Здесь должна быть логика получения статуса из БД
    const dayNumber = parseInt(format(date, 'd'))
    return {
      date,
      day: dayNumber,
      attended: [2, 5, 8, 12, 15, 19, 22].includes(dayNumber),
      missed: [3, 10, 17].includes(dayNumber),
      planned: [25, 28].includes(dayNumber)
    }
  })
  
  return [...emptyDays, ...daysWithStatus]
})

// Последние тренировки
const recentWorkouts = ref([
  {
    id: 1,
    title: 'Силовая тренировка',
    date: new Date(2024, 0, 22, 16, 30),
    duration: 45,
    calories: 350,
    trainer: 'Михаил Петров',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Кардио',
    date: new Date(2024, 0, 20, 17, 0),
    duration: 30,
    calories: 250,
    trainer: 'Анна Смирнова',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Йога',
    date: new Date(2024, 0, 24, 18, 0),
    duration: 60,
    calories: 200,
    trainer: 'Елена Иванова',
    status: 'planned'
  }
])

// Категории прогресса
const progressCategories = ref([
  {
    id: 1,
    name: 'Сила',
    icon: 'fas fa-dumbbell',
    color: '#2196F3',
    currentLevel: 'Начинающий',
    nextLevel: 'Средний',
    progress: 65,
    details: [
      { label: 'Жим лежа', value: '35 кг' },
      { label: 'Приседания', value: '40 кг' }
    ]
  },
  {
    id: 2,
    name: 'Выносливость',
    icon: 'fas fa-heart',
    color: '#FF9800',
    currentLevel: 'Средний',
    nextLevel: 'Продвинутый',
    progress: 70,
    details: [
      { label: 'Бег', value: '15 мин' },
      { label: 'Пульс', value: '145 уд/мин' }
    ]
  },
  {
    id: 3,
    name: 'Гибкость',
    icon: 'fas fa-pray',
    color: '#9C27B0',
    currentLevel: 'Средний',
    nextLevel: 'Хороший',
    progress: 55,
    details: [
      { label: 'Наклон вперед', value: '25 см' },
      { label: 'Мостик', value: '30 сек' }
    ]
  }
])

// Уведомления
const notifications = ref([
  {
    id: 1,
    type: 'info',
    icon: 'fas fa-info-circle',
    title: 'Прогресс ребенка',
    message: 'Иван улучшил свой результат в силовой тренировке',
    date: new Date(2024, 0, 22, 10, 30),
    read: false
  },
  {
    id: 2,
    type: 'warning',
    icon: 'fas fa-exclamation-triangle',
    title: 'Пропуск тренировки',
    message: 'Иван пропустил тренировку 20 января',
    date: new Date(2024, 0, 21, 9, 0),
    read: false
  },
  {
    id: 3,
    type: 'success',
    icon: 'fas fa-trophy',
    title: 'Новое достижение',
    message: 'Иван получил достижение "10 тренировок подряд"',
    date: new Date(2024, 0, 19, 14, 15),
    read: true
  }
])

// Методы для календаря
const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

// Форматирование даты
const formatDate = (date, formatType) => {
  if (formatType === 'relative') {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return `${hours} ч назад`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} дн назад`
    }
  }
  
  return format(new Date(date), formatType === 'DD' ? 'd' : formatType === 'MMM' ? 'MMM' : 'dd.MM.yyyy', { locale: ru })
}

// Отметка уведомления как прочитанного
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

// Связь с тренером
const contactTrainer = () => {
  // Логика открытия чата с тренером
  console.log('Contact trainer')
}

// Инициализация графиков
onMounted(() => {
  // График посещаемости
  if (attendanceChart.value) {
    new Chart(attendanceChart.value, {
      type: 'line',
      data: attendanceData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          }
        }
      }
    })
  }

  // График прогресса
  if (progressChart.value) {
    new Chart(progressChart.value, {
      type: 'line',
      data: progressData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          }
        }
      }
    })
  }
})
</script>

<style scoped>
.parent-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.child-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  color: white;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 30px;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.child-avatar {
  position: relative;
  width: 100px;
  height: 100px;
}

.child-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
}

.child-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid white;
}

.child-status.active {
  background: #4CAF50;
}

.child-details h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.child-age {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.child-contacts {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.child-contacts i {
  margin-right: 5px;
  opacity: 0.9;
}

.child-stats {
  display: flex;
  gap: 30px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 3px;
}

.stat-detail {
  font-size: 12px;
  color: #999;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chart-container h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.chart-container canvas {
  height: 300px;
  width: 100%;
}

.attendance-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}

.attendance-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-month {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.calendar {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9f9f9;
  padding: 10px;
  font-weight: 500;
  color: #666;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  aspect-ratio: 1;
  padding: 5px;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day.empty {
  background: #fafafa;
}

.day-number {
  font-size: 14px;
  color: #666;
}

.day-status {
  position: absolute;
  top: 5px;
  right: 5px;
}

.day-status i {
  font-size: 12px;
}

.calendar-day.attended .day-status i {
  color: #4CAF50;
}

.calendar-day.missed .day-status i {
  color: #f44336;
}

.calendar-day.planned .day-status i {
  color: #FF9800;
}

.recent-workouts {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}

.recent-workouts h3 {
  margin-bottom: 20px;
  color: #333;
}

.workouts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.workout-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.workout-item:hover {
  background: #f9f9f9;
}

.workout-date {
  text-align: center;
  min-width: 60px;
}

.workout-date .day {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1;
}

.workout-date .month {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.workout-info {
  flex: 1;
}

.workout-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.workout-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.workout-meta i {
  margin-right: 3px;
}

.workout-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.workout-status.completed {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.workout-status.planned {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.progress-details {
  margin-bottom: 30px;
}

.progress-details h3 {
  margin-bottom: 20px;
  color: #333;
}

.progress-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.category-header i {
  font-size: 20px;
}

.category-header h4 {
  font-size: 18px;
  color: #333;
}

.category-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.category-stat {
  text-align: center;
}

.category-stat .stat-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 5px;
}

.category-stat .stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.progress-bar-container {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.category-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 500;
  color: #333;
}

.notifications-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}

.notifications-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.info .notification-icon {
  color: #2196F3;
}

.notification-item.warning .notification-icon {
  color: #FF9800;
}

.notification-item.success .notification-icon {
  color: #4CAF50;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.notification-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.notification-date {
  font-size: 12px;
  color: #999;
}

.contact-trainer {
  text-align: center;
  padding: 20px 0;
}

.btn-large {
  padding: 15px 40px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .child-info-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .child-avatar {
    margin: 0 auto;
  }
  
  .child-contacts {
    justify-content: center;
  }
  
  .child-stats {
    justify-content: center;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .workout-item {
    flex-wrap: wrap;
  }
  
  .notification-item {
    flex-wrap: wrap;
  }
}
</style>