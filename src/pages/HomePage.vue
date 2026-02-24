<template>
  <div class="home-page">
    <!-- Hero секция -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Твой путь к идеальному телу</h1>
        <p class="hero-subtitle">Персональные тренировки, отслеживание прогресса и поддержка профессиональных тренеров</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="handleStartWorkout">Начать тренировку</button>
          <button class="btn btn-secondary" @click="handleLearnMore">Узнать больше</button>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/hero-fitness.svg" alt="Fitness" />
      </div>
    </section>

    <!-- Преимущества -->
    <section class="features">
      <h2 class="section-title">Почему выбирают нас</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.id" class="feature-card">
          <div class="feature-icon" :style="{ backgroundColor: feature.color + '20' }">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Популярные тренировки -->
    <section class="popular-workouts">
      <h2 class="section-title">Популярные тренировки</h2>
      <div class="workouts-grid">
        <div v-for="workout in popularWorkouts" :key="workout.id" class="workout-card">
          <div class="workout-image">
            <img :src="workout.image" :alt="workout.title" />
            <span class="workout-difficulty" :class="workout.difficulty.toLowerCase()">
              {{ workout.difficulty }}
            </span>
          </div>
          <div class="workout-info">
            <h3>{{ workout.title }}</h3>
            <div class="workout-meta">
              <span><i class="far fa-clock"></i> {{ workout.duration }} мин</span>
              <span><i class="far fa-fire"></i> {{ workout.calories }} ккал</span>
            </div>
            <button class="btn btn-outline" @click="startWorkout(workout.id)">Начать</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="testimonials">
      <h2 class="section-title">Что говорят наши клиенты</h2>
      <div class="testimonials-slider">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
          <div class="testimonial-rating">
            <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= testimonial.rating }"></i>
          </div>
          <p class="testimonial-text">"{{ testimonial.text }}"</p>
          <div class="testimonial-author">
            <img :src="testimonial.avatar" :alt="testimonial.name" />
            <div>
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA секция -->
    <section class="cta">
      <div class="cta-content">
        <h2>Готов начать свой путь?</h2>
        <p>Присоединяйся к тысячам людей, которые уже достигли своих целей</p>
        <button class="btn btn-primary btn-large" @click="handleRegister">Зарегистрироваться сейчас</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Данные для преимуществ
const features = ref([
  {
    id: 1,
    icon: 'fas fa-chart-line',
    title: 'Отслеживание прогресса',
    description: 'Детальная статистика и графики ваших достижений',
    color: '#4CAF50'
  },
  {
    id: 2,
    icon: 'fas fa-user-tie',
    title: 'Профессиональные тренеры',
    description: 'Сертифицированные специалисты с опытом работы',
    color: '#2196F3'
  },
  {
    id: 3,
    icon: 'fas fa-dumbbell',
    title: 'Разнообразие тренировок',
    description: 'Более 100 программ для любых целей',
    color: '#FF9800'
  },
  {
    id: 4,
    icon: 'fas fa-users',
    title: 'Сообщество',
    description: 'Общайтесь и соревнуйтесь с другими пользователями',
    color: '#9C27B0'
  }
])

// Популярные тренировки
const popularWorkouts = ref([
  {
    id: 1,
    title: 'Силовая тренировка',
    image: 'https://via.placeholder.com/300x200',
    difficulty: 'Средний',
    duration: 45,
    calories: 350
  },
  {
    id: 2,
    title: 'Йога для начинающих',
    image: 'https://via.placeholder.com/300x200',
    difficulty: 'Легкий',
    duration: 30,
    calories: 150
  },
  {
    id: 3,
    title: 'HIIT тренировка',
    image: 'https://via.placeholder.com/300x200',
    difficulty: 'Сложный',
    duration: 25,
    calories: 400
  }
])

// Отзывы
const testimonials = ref([
  {
    id: 1,
    text: 'Лучшее приложение для тренировок! За 3 месяца похудел на 10 кг',
    name: 'Алексей Петров',
    role: 'Клиент',
    rating: 5,
    avatar: 'https://via.placeholder.com/50'
  },
  {
    id: 2,
    text: 'Очень удобно отслеживать прогресс. Тренеры всегда на связи',
    name: 'Елена Смирнова',
    role: 'Клиент',
    rating: 5,
    avatar: 'https://via.placeholder.com/50'
  },
  {
    id: 3,
    text: 'Разнообразные тренировки, никогда не бывает скучно',
    name: 'Дмитрий Иванов',
    role: 'Клиент',
    rating: 4,
    avatar: 'https://via.placeholder.com.com/50'
  }
])

// Методы
const handleStartWorkout = () => {
  router.push('/workouts')
}

const handleLearnMore = () => {
  router.push('/about')
}

const startWorkout = (workoutId) => {
  router.push(`/workout/${workoutId}`)
}

const handleRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 60px 0;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.hero-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}

.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
}

.section-title {
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
}

.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.workout-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  background: white;
}

.workout-image {
  position: relative;
  height: 200px;
}

.workout-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.workout-difficulty {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.workout-difficulty.легкий {
  background: #4CAF50;
}

.workout-difficulty.средний {
  background: #FF9800;
}

.workout-difficulty.сложный {
  background: #f44336;
}

.workout-info {
  padding: 20px;
}

.workout-meta {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.workout-meta i {
  margin-right: 5px;
}

.testimonials {
  padding: 60px 0;
  background: #f9f9f9;
  margin: 0 -20px;
  padding: 60px 20px;
}

.testimonials-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.testimonial-rating {
  margin-bottom: 15px;
}

.testimonial-rating i {
  color: #ddd;
  margin-right: 3px;
}

.testimonial-rating i.filled {
  color: #FFD700;
}

.testimonial-text {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.testimonial-author img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-author h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.testimonial-author p {
  font-size: 14px;
  color: #666;
}

.cta {
  padding: 80px 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 36px;
  color: #333;
  margin-bottom: 15px;
}

.cta-content p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.btn-large {
  padding: 15px 40px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style>