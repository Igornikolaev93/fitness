<template>
  <div class="child-progress-page">
    <div v-if="parentStore.selectedChild">
      <h1>Прогресс ученика: {{ parentStore.selectedChild.name }}</h1>

      <div class="progress-summary">
        <div class="summary-card">
          <i class="fas fa-running"></i>
          <p><strong>Выносливость:</strong> {{ parentStore.childProgress.stamina.level }}</p>
        </div>
        <div class="summary-card">
          <i class="fas fa-dumbbell"></i>
          <p><strong>Сила:</strong> {{ parentStore.childProgress.strength.level }}</p>
        </div>
        <div class="summary-card">
          <i class="fas fa-tachometer-alt"></i>
          <p><strong>Скорость:</strong> {{ parentStore.childProgress.speed.level }}</p>
        </div>
      </div>

      <div class="progress-charts">
        <canvas ref="progressChart"></canvas>
      </div>
    </div>
    <div v-else>
      <p>Выберите ученика для просмотра прогресса.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useParentStore } from '@/store/parent';
import Chart from 'chart.js/auto';

const parentStore = useParentStore();
const progressChart = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (progressChart.value && parentStore.childProgress) {
    chartInstance = new Chart(progressChart.value.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Выносливость', 'Сила', 'Скорость'],
        datasets: [
          {
            label: 'Текущий Прогресс',
            data: [
              parentStore.childProgress.stamina.value,
              parentStore.childProgress.strength.value,
              parentStore.childProgress.speed.value,
            ],
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: '#667eea',
            pointBackgroundColor: '#667eea',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

onMounted(() => {
  renderChart();
});

watch(() => parentStore.childProgress, () => {
  renderChart();
});
</script>

<style scoped>
.child-progress-page {
  padding: 20px;
}
.progress-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.summary-card {
  text-align: center;
}
.progress-charts {
  height: 400px;
}
</style>
