import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import WorkoutPage from '../pages/WorkoutPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import ParentPage from '../pages/ParentPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import CoachPage from '../pages/CoachPage.vue'
import CreateWorkoutPage from '../pages/CreateWorkoutPage.vue'
import ClientsPage from '../pages/ClientsPage.vue'

const routes = [
  {
    path: '/',
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router