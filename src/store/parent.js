import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

export const useParentStore = defineStore('parent', () => {
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
  });

  const attendance = reactive({
    percentage: 85,
    visited: 48,
    total: 56
  });

  const progress = reactive({
    percentage: 70,
    current: 7,
    target: 10
  });

  const achievements = reactive({
    unlocked: 8,
    total: 15
  });

  const totalTime = reactive({
    hours: 42,
    minutes: 2520
  });

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
  });

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
  });

  const currentDate = ref(new Date());
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const currentMonthName = computed(() => format(currentDate.value, 'LLLL', { locale: ru }));
  const currentYear = computed(() => format(currentDate.value, 'yyyy'));

  const calendarDays = computed(() => {
    const start = startOfMonth(currentDate.value);
    const end = endOfMonth(currentDate.value);
    const days = eachDayOfInterval({ start, end });
    const firstDayIndex = start.getDay() === 0 ? 6 : start.getDay() - 1;
    const emptyDays = Array(firstDayIndex).fill({ date: null, day: '', attended: false, missed: false, planned: false });
    const daysWithStatus = days.map(date => {
      const dayNumber = parseInt(format(date, 'd'));
      return {
        date,
        day: dayNumber,
        attended: [2, 5, 8, 12, 15, 19, 22].includes(dayNumber),
        missed: [3, 10, 17].includes(dayNumber),
        planned: [25, 28].includes(dayNumber)
      };
    });
    return [...emptyDays, ...daysWithStatus];
  });

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
  ]);

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
  ]);

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
  ]);

  const workouts = ref([]);
  const currentWorkout = ref(null);
  const workoutHistory = ref([]);
  const workoutOptions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const completedWorkouts = computed(() => 
    workoutHistory.value.filter(w => w.status === 'completed')
  );
  
  const plannedWorkouts = computed(() => 
    workoutHistory.value.filter(w => w.status === 'planned')
  );

  const totalWorkoutTime = computed(() => 
    workoutHistory.value.reduce((acc, w) => acc + (w.duration || 0), 0)
  );

  const totalCaloriesBurned = computed(() => 
    workoutHistory.value.reduce((acc, w) => acc + (w.calories || 0), 0)
  );

  async function fetchWorkouts(userId) {
    loading.value = true;
    try {
      const response = await fetch(`/api/users/${userId}/workouts`);
      workouts.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchWorkoutHistory(userId) {
    loading.value = true;
    try {
      const response = await fetch(`/api/users/${userId}/workouts/history`);
      workoutHistory.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function calculateWorkoutOptions(userId, workoutType) {
    loading.value = true;
    try {
      const response = await fetch(`/api/users/${userId}/workouts/calculate`, {
        method: 'POST',
        body: JSON.stringify({ type: workoutType })
      });
      workoutOptions.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function selectWorkoutOption(optionId) {
    currentWorkout.value = workoutOptions.value.find(o => o.id === optionId);
  }

  async function startWorkout(workoutId) {
    loading.value = true;
    try {
      const response = await fetch(`/api/workouts/${workoutId}/start`, {
        method: 'POST'
      });
      currentWorkout.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function completeWorkout(workoutId, completionData) {
    loading.value = true;
    try {
      const response = await fetch(`/api/workouts/${workoutId}/complete`, {
        method: 'POST',
        body: JSON.stringify(completionData)
      });
      const completed = await response.json();
      workoutHistory.value.unshift(completed);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function scheduleWorkout(workoutData) {
    loading.value = true;
    try {
      const response = await fetch('/api/workouts/schedule', {
        method: 'POST',
        body: JSON.stringify(workoutData)
      });
      const scheduled = await response.json();
      workoutHistory.value.push(scheduled);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }


  function prevMonth() {
    currentDate.value = subMonths(currentDate.value, 1);
  }

  function nextMonth() {
    currentDate.value = addMonths(currentDate.value, 1);
  }

  function formatDate(date, formatType) {
    if (formatType === 'relative') {
      const diff = Date.now() - new Date(date).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) {
        return `${hours} ч назад`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days} дн назад`;
      }
    }
    return format(new Date(date), formatType === 'DD' ? 'd' : formatType === 'MMM' ? 'MMM' : 'dd.MM.yyyy', { locale: ru });
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  function contactTrainer() {
    console.log('Contact trainer');
  }

  return {
    child,
    attendance,
    progress,
    achievements,
    totalTime,
    attendanceData,
    progressData,
    currentDate,
    weekdays,
    currentMonthName,
    currentYear,
    calendarDays,
    recentWorkouts,
    progressCategories,
    notifications,
    workouts,
    currentWorkout,
    workoutHistory,
    workoutOptions,
    loading,
    error,
    completedWorkouts,
    plannedWorkouts,
    totalWorkoutTime,
    totalCaloriesBurned,
    fetchWorkouts,
    fetchWorkoutHistory,
    calculateWorkoutOptions,
    selectWorkoutOption,
    startWorkout,
    completeWorkout,
    scheduleWorkout,
    prevMonth,
    nextMonth,
    formatDate,
    markAsRead,
    contactTrainer
  };
});