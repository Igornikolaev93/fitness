import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import WorkoutPage from '@/pages/WorkoutPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ParentPage from '@/pages/ParentPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import CoachPage from '@/pages/CoachPage.vue'
import CreateWorkoutPage from '@/pages/CreateWorkoutPage.vue'
import ClientsPage from '@/pages/ClientsPage.vue'
import HomePage from '@/pages/HomePage.vue'
import CalculateProgressPage from '@/pages/CalculateProgressPage.vue'
import AdminAlgorithmSettingsPage from '@/pages/AdminAlgorithmSettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage
  },
  {
    path: '/workout/:id',
    name: 'Workout',
    component: WorkoutPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  },
  {
    path: '/parent',
    name: 'Parent',
    component: ParentPage
  },
  {
    path: '/coach',
    name: 'Coach',
    component: CoachPage
  },
  {
    path: '/create-workout',
    name: 'CreateWorkout',
    component: CreateWorkoutPage
  },
  {
    path: '/clients',
    name: 'Clients',
    component: ClientsPage
  },
  {
    path: '/calculate-progress',
    name: 'CalculateProgress',
    component: CalculateProgressPage
  },
  {
    path: '/admin/algorithm-settings',
    name: 'AdminAlgorithmSettings',
    component: AdminAlgorithmSettingsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router