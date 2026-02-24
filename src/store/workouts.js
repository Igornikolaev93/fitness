
import { defineStore } from 'pinia'
import clientsData from '@/clients.json'
import workoutsData from '@/workouts.json'
import createdWorkoutsData from '@/createdWorkouts.json'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    exercises: [],
    clients: [],
    workouts: [],
    createdWorkouts: [],
    performanceHistory: [],
  }),
  actions: {
    addExercise(exercise) {
      this.exercises.push(exercise)
    },
    saveWorkout() {
      // Here you would typically send the data to a server
      console.log('Saving workout:', this.exercises)
      // Clear the exercises after saving
      this.exercises = []
    },
    async fetchClients() {
      this.clients = clientsData
      return this.clients
    },
    async fetchWorkouts() {
      this.workouts = workoutsData
      return this.workouts
    },
    assignWorkout(clientId, workoutId) {
      console.log(`Assigning workout ${workoutId} to client ${clientId}`)
    },
    async fetchCreatedWorkouts() {
      this.createdWorkouts = createdWorkoutsData
      return this.createdWorkouts
    },
    recordPerformance({ workoutId, sets, reps, weight }) {
      const performanceData = {
        workoutId,
        sets,
        reps,
        weight,
        load: sets * reps * weight,
        date: new Date().toISOString(),
      }
      this.performanceHistory.push(performanceData)
    },
  },
})
