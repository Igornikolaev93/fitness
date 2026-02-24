<template>
  <div class="admin-algorithm-settings">
    <div class="admin-header">
      <h1>Настройка алгоритмов прогрессии</h1>
      <p class="subtitle">Управление логикой расчета нагрузки для тренировок</p>
    </div>

    <!-- Навигация по разделам -->
    <div class="admin-tabs">
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

    <!-- Алгоритмы -->
    <div v-if="activeTab === 'algorithms'" class="algorithms-section">
      <div class="section-header">
        <h2>Алгоритмы расчета нагрузки</h2>
        <button class="btn btn-primary" @click="openAddModal('algorithm')">
          <i class="fas fa-plus"></i> Добавить алгоритм
        </button>
      </div>

      <div class="algorithms-grid">
        <div v-for="algorithm in algorithms" :key="algorithm.id" class="algorithm-card">
          <div class="algorithm-header">
            <div class="algorithm-status" :class="{ active: algorithm.active }">
              {{ algorithm.active ? 'Активен' : 'Неактивен' }}
            </div>
            <h3>{{ algorithm.name }}</h3>
          </div>
          
          <p class="algorithm-description">{{ algorithm.description }}</p>
          
          <div class="algorithm-params">
            <h4>Параметры</h4>
            <div v-for="(value, key) in algorithm.params" :key="key" class="param-item">
              <span class="param-name">{{ formatParamName(key) }}:</span>
              <span class="param-value">{{ value }}</span>
            </div>
          </div>

          <div class="algorithm-actions">
            <button class="btn btn-outline" @click="openEditModal('algorithm', algorithm)">
              <i class="fas fa-edit"></i> Редактировать
            </button>
            <button class="btn btn-outline" @click="store.toggleAlgorithm(algorithm)">
              <i class="fas" :class="algorithm.active ? 'fa-pause' : 'fa-play'"></i>
              {{ algorithm.active ? 'Деактивировать' : 'Активировать' }}
            </button>
            <button class="btn btn-outline-danger" @click="handleDeleteAlgorithm(algorithm)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Факторы -->
    <div v-if="activeTab === 'factors'" class="factors-section">
      <div class="section-header">
        <h2>Факторы влияния</h2>
        <button class="btn btn-primary" @click="openAddModal('factor')">
          <i class="fas fa-plus"></i> Добавить фактор
        </button>
      </div>

      <div class="factors-list">
        <div v-for="factor in factors" :key="factor.id" class="factor-item">
          <div class="factor-info">
            <div class="factor-icon" :style="{ backgroundColor: factor.color + '20' }">
              <i :class="factor.icon" :style="{ color: factor.color }"></i>
            </div>
            <div class="factor-details">
              <h4>{{ factor.name }}</h4>
              <p>{{ factor.description }}</p>
            </div>
          </div>

          <div class="factor-settings">
            <div class="setting">
              <label>Вес фактора</label>
              <input 
                type="number" 
                :value="factor.weight"
                @input="updateFactorField(factor, 'weight', $event.target.value)" 
                min="0" 
                max="1" 
                step="0.1"
              >
            </div>
            <div class="setting">
              <label>Мин. значение</label>
              <input type="number" :value="factor.minValue" @input="updateFactorField(factor, 'minValue', $event.target.value)">
            </div>
            <div class="setting">
              <label>Макс. значение</label>
              <input type="number" :value="factor.maxValue" @input="updateFactorField(factor, 'maxValue', $event.target.value)">
            </div>
            <div class="setting">
              <label>Формула</label>
              <select :value="factor.formula" @change="updateFactorField(factor, 'formula', $event.target.value)">
                <option value="linear">Линейная</option>
                <option value="exponential">Экспоненциальная</option>
                <option value="logarithmic">Логарифмическая</option>
                <option value="custom">Пользовательская</option>
              </select>
            </div>
          </div>

          <div class="factor-status">
            <label class="switch">
              <input type="checkbox" :checked="factor.enabled" @change="updateFactorField(factor, 'enabled', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <button class="btn btn-outline-danger" @click="handleDeleteFactor(factor)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Правила -->
    <div v-if="activeTab === 'rules'" class="rules-section">
      <div class="section-header">
        <h2>Правила прогрессии</h2>
        <button class="btn btn-primary" @click="openAddModal('rule')">
          <i class="fas fa-plus"></i> Добавить правило
        </button>
      </div>

      <div class="rules-list">
        <div v-for="rule in rules" :key="rule.id" class="rule-item">
          <div class="rule-header">
            <h4>{{ rule.name }}</h4>
            <div class="rule-status" :class="{ active: rule.active }">
              {{ rule.active ? 'Активно' : 'Неактивно' }}
            </div>
          </div>

          <p class="rule-description">{{ rule.description }}</p>

          <div class="rule-condition">
            <strong>Условие:</strong> {{ rule.condition }}
          </div>

          <div class="rule-action">
            <strong>Действие:</strong> {{ rule.action }}
          </div>

          <div class="rule-actions">
            <button class="btn btn-outline" @click="openEditModal('rule', rule)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline" @click="store.toggleRule(rule)">
              <i class="fas" :class="rule.active ? 'fa-pause' : 'fa-play'"></i>
            </button>
            <button class="btn btn-outline-danger" @click="handleDeleteRule(rule)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- История изменений -->
    <div v-if="activeTab === 'history'" class="history-section">
      <h2>История изменений алгоритмов</h2>
      
      <div class="history-timeline">
        <div v-for="change in history" :key="change.id" class="history-item">
          <div class="history-date">{{ formatDate(change.timestamp) }}</div>
          <div class="history-content">
            <div class="history-user">
              <img :src="change.user.avatar" :alt="change.user.name">
              <span>{{ change.user.name }}</span>
            </div>
            <div class="history-action">{{ change.action }}</div>
            <div class="history-details">{{ change.details }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для редактирования -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode === 'add' ? 'Добавление' : 'Редактирование' }} {{ modalType }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Форма для алгоритма -->
          <div v-if="modalType === 'algorithm'">
            <div class="form-group">
              <label>Название</label>
              <input type="text" v-model="modalData.name">
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="modalData.description"></textarea>
            </div>
            <div class="form-group">
              <label>Параметры (JSON)</label>
              <textarea v-model="modalData.paramsJson" rows="5"></textarea>
            </div>
          </div>

          <!-- Форма для фактора -->
          <div v-if="modalType === 'factor'">
            <div class="form-group">
              <label>Название</label>
              <input type="text" v-model="modalData.name">
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="modalData.description"></textarea>
            </div>
            <div class="form-group">
              <label>Иконка</label>
              <input type="text" v-model="modalData.icon">
            </div>
            <div class="form-group">
              <label>Цвет</label>
              <input type="color" v-model="modalData.color">
            </div>
            <div class="form-group">
              <label>Вес фактора (0-1)</label>
              <input type="number" v-model="modalData.weight" min="0" max="1" step="0.1">
            </div>
          </div>

          <!-- Форма для правила -->
          <div v-if="modalType === 'rule'">
            <div class="form-group">
              <label>Название</label>
              <input type="text" v-model="modalData.name">
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="modalData.description"></textarea>
            </div>
            <div class="form-group">
              <label>Условие</label>
              <input type="text" v-model="modalData.condition">
            </div>
            <div class="form-group">
              <label>Действие</label>
              <input type="text" v-model="modalData.action">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">Отмена</button>
          <button class="btn btn-primary" @click="saveModal">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/store/admin'
import { storeToRefs } from 'pinia'

const store = useAdminStore()
const { algorithms, factors, rules, history } = storeToRefs(store)

const activeTab = ref('algorithms')
const showModal = ref(false)
const modalMode = ref('add')
const modalType = ref('algorithm')
const modalData = ref({})

// Вкладки
const tabs = ref([
  { id: 'algorithms', name: 'Алгоритмы', icon: 'fas fa-robot' },
  { id: 'factors', name: 'Факторы', icon: 'fas fa-balance-scale' },
  { id: 'rules', name: 'Правила', icon: 'fas fa-gavel' },
  { id: 'history', name: 'История', icon: 'fas fa-history' }
])

const openAddModal = (type) => {
  modalMode.value = 'add'
  modalType.value = type
  if (type === 'algorithm') {
    modalData.value = { name: '', description: '', paramsJson: '{}' }
  } else if (type === 'factor') {
    modalData.value = { name: '', description: '', icon: 'fas fa-circle', color: '#667eea', weight: 0.1, minValue: 0, maxValue: 100, formula: 'linear', enabled: true }
  } else if (type === 'rule') {
    modalData.value = { name: '', description: '', condition: '', action: '', active: true }
  }
  showModal.value = true
}

const openEditModal = (type, data) => {
  modalMode.value = 'edit'
  modalType.value = type
  if (type === 'algorithm') {
    modalData.value = { ...data, paramsJson: JSON.stringify(data.params, null, 2) }
  } else {
    modalData.value = { ...data }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveModal = async () => {
  if (modalType.value === 'algorithm') {
    try {
      const params = JSON.parse(modalData.value.paramsJson)
      const data = { ...modalData.value, params }
      delete data.paramsJson

      if (modalMode.value === 'add') {
        await store.addAlgorithm({ ...data, id: Date.now(), active: true })
      } else {
        await store.updateAlgorithm(data)
      }
    } catch (e) {
      alert('Неверный формат JSON для параметров')
      return
    }
  } else if (modalType.value === 'factor') {
    const data = { ...modalData.value }
    if (modalMode.value === 'add') {
      await store.addFactor({ ...data, id: Date.now() })
    } else {
      await store.updateFactor(data)
    }
  } else if (modalType.value === 'rule') {
    const data = { ...modalData.value }
    if (modalMode.value === 'add') {
      await store.addRule({ ...data, id: Date.now() })
    } else {
      await store.updateRule(data)
    }
  }
  
  closeModal()
}

const handleDeleteAlgorithm = async (algorithm) => {
  if (confirm(`Удалить алгоритм "${algorithm.name}"?`)) {
    await store.deleteAlgorithm(algorithm)
  }
}

const handleDeleteFactor = async (factor) => {
  if (confirm(`Удалить фактор "${factor.name}"?`)) {
    await store.deleteFactor(factor)
  }
}

const handleDeleteRule = async (rule) => {
  if (confirm(`Удалить правило "${rule.name}"?`)) {
    await store.deleteRule(rule)
  }
}

const updateFactorField = (factor, field, value) => {
  const updatedFactor = { ...factor, [field]: value };
  store.updateFactor(updatedFactor);
};

const formatParamName = (key) => {
  const names = {
    increase: 'Процент увеличения',
    period: 'Период',
    maxIncrease: 'Макс. увеличение',
    sensitivity: 'Чувствительность',
    minDecrease: 'Мин. снижение',
    cycles: 'Количество циклов',
    peakWeek: 'Пиковая неделя',
    recoveryWeek: 'Неделя восстановления'
  }
  return names[key] || key
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Инициализация
onMounted(() => {
  store.loadAlgorithms()
  store.loadFactors()
  store.loadRules()
  store.loadHistory()
})
</script>

<style scoped>
.admin-algorithm-settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
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
  font-size: 24px;
  color: #333;
}

.algorithms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.algorithm-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}

.algorithm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.algorithm-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
}

.algorithm-status.active {
  background: #4CAF50;
  color: white;
}

.algorithm-description {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.algorithm-params {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.algorithm-params h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #555;
}

.param-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 13px;
}

.param-name {
  color: #666;
}

.param-value {
  font-weight: 500;
  color: #333;
}

.algorithm-actions {
  display: flex;
  gap: 10px;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.factor-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 2fr auto auto;
  gap: 20px;
  align-items: center;
  border: 1px solid #f0f0f0;
}

.factor-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.factor-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.factor-details h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.factor-details p {
  font-size: 13px;
  color: #666;
}

.factor-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.setting {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.setting label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}

.setting input,
.setting select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  width: 100%;
}

.factor-status {
  display: flex;
  align-items: center;
}

/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.rules-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.rule-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rule-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
}

.rule-status.active {
  background: #4CAF50;
  color: white;
}

.rule-description {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.rule-condition,
.rule-action {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 13px;
}

.rule-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.history-timeline {
  position: relative;
  padding-left: 30px;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #f0f0f0;
}

.history-item {
  position: relative;
  margin-bottom: 20px;
  padding-left: 30px;
}

.history-item::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.history-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.history-content {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.history-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.history-user img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.history-action {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.history-details {
  color: #666;
  font-size: 14px;
}

/* Modal */
.modal {
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
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.modal-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-outline-danger {
  border-color: #f44336;
  color: #f44336;
}

.btn-outline-danger:hover {
  background: #f44336;
  color: white;
}

@media (max-width: 768px) {
  .factor-item {
    grid-template-columns: 1fr;
  }
  
  .admin-tabs {
    flex-wrap: wrap;
  }
  
  .algorithms-grid {
    grid-template-columns: 1fr;
  }
  
  .rules-list {
    grid-template-columns: 1fr;
  }
}
</style>