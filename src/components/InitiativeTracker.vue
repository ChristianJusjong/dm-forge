<template>
  <div class="initiative-tracker">
    <div class="tracker-header">
      <h2>⚔️ {{ t('initiativeTracker') }}</h2>
      <div class="round-counter">
        <span>{{ t('round') }}: {{ round }}</span>
        <button @click="nextRound" class="btn-small">{{ t('nextRound') }}</button>
        <button @click="resetCombat" class="btn-small btn-danger">{{ t('reset') }}</button>
      </div>
    </div>

    <div class="add-combatant">
      <input v-model="newCombatant.name" :placeholder="t('namePlaceholder')" class="input" @keyup.enter="addCombatant">
      <input v-model.number="newCombatant.initiative" type="number" :placeholder="t('initiativePlaceholder')" class="input short" @keyup.enter="addCombatant">
      <input v-model.number="newCombatant.hp" type="number" :placeholder="t('hp')" class="input short" @keyup.enter="addCombatant">
      <input v-model.number="newCombatant.ac" type="number" :placeholder="t('ac')" class="input short" @keyup.enter="addCombatant">
      <button @click="addCombatant" class="btn">{{ t('add') }}</button>
    </div>

    <div class="combatants-list">
      <div
        v-for="(combatant, index) in sortedCombatants"
        :key="combatant.id"
        :class="['combatant-card', { active: index === currentTurn, dead: combatant.hp <= 0 }]"
      >
        <div class="combatant-info">
          <div class="combatant-header">
            <h3>{{ combatant.name }}</h3>
            <span class="initiative-badge">{{ combatant.initiative }}</span>
          </div>
          <div class="combatant-stats">
            <div class="stat-group">
              <label>HP:</label>
              <input
                v-model.number="combatant.hp"
                type="number"
                class="input-small"
              >
              <span class="stat-max">/ {{ combatant.maxHp }}</span>
              <div class="hp-buttons">
                <button @click="adjustHp(combatant, -1)" class="btn-tiny">-</button>
                <button @click="adjustHp(combatant, 1)" class="btn-tiny">+</button>
              </div>
            </div>
            <div class="stat-display">
              <span>AC: {{ combatant.ac }}</span>
            </div>
          </div>
          <div v-if="combatant.conditions.length" class="conditions">
            <span
              v-for="condition in combatant.conditions"
              :key="condition"
              class="condition-badge"
              @click="removeCondition(combatant, condition)"
            >
              {{ condition }} ×
            </span>
          </div>
          <div class="condition-add">
            <input
              v-model="combatant.newCondition"
              :placeholder="t('addCondition')"
              class="input-small"
              @keyup.enter="addCondition(combatant)"
            >
            <button @click="addCondition(combatant)" class="btn-tiny">+</button>
          </div>
        </div>
        <div class="combatant-actions">
          <button @click="removeCombatant(combatant.id)" class="btn-icon" :title="t('remove')">🗑️</button>
        </div>
      </div>

      <div v-if="sortedCombatants.length === 0" class="empty-state">
        <p>{{ t('noCombatants') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'InitiativeTracker',
  props: {
    geminiApiKey: String
  },
  setup() {
    const { t } = useI18n()
    const combatants = ref([])
    const round = ref(1)
    const currentTurn = ref(0)
    const newCombatant = ref({
      name: '',
      initiative: 0,
      hp: 10,
      ac: 10
    })

    const sortedCombatants = computed(() => {
      return [...combatants.value].sort((a, b) => b.initiative - a.initiative)
    })

    const loadCombatants = () => {
      const saved = localStorage.getItem('initiative_tracker')
      if (saved) {
        const data = JSON.parse(saved)
        combatants.value = data.combatants || []
        round.value = data.round || 1
        currentTurn.value = data.currentTurn || 0
      }
    }

    const saveCombatants = () => {
      localStorage.setItem('initiative_tracker', JSON.stringify({
        combatants: combatants.value,
        round: round.value,
        currentTurn: currentTurn.value
      }))
    }

    const addCombatant = () => {
      if (newCombatant.value.name.trim()) {
        combatants.value.push({
          id: Date.now(),
          name: newCombatant.value.name,
          initiative: newCombatant.value.initiative || 0,
          hp: newCombatant.value.hp || 10,
          maxHp: newCombatant.value.hp || 10,
          ac: newCombatant.value.ac || 10,
          conditions: [],
          newCondition: ''
        })
        newCombatant.value = { name: '', initiative: 0, hp: 10, ac: 10 }
        saveCombatants()
      }
    }

    const removeCombatant = (id) => {
      combatants.value = combatants.value.filter(c => c.id !== id)
      saveCombatants()
    }

    const adjustHp = (combatant, amount) => {
      combatant.hp = Math.max(0, combatant.hp + amount)
      saveCombatants()
    }

    const addCondition = (combatant) => {
      if (combatant.newCondition.trim()) {
        combatant.conditions.push(combatant.newCondition.trim())
        combatant.newCondition = ''
        saveCombatants()
      }
    }

    const removeCondition = (combatant, condition) => {
      combatant.conditions = combatant.conditions.filter(c => c !== condition)
      saveCombatants()
    }

    const nextRound = () => {
      currentTurn.value++
      if (currentTurn.value >= sortedCombatants.value.length) {
        currentTurn.value = 0
        round.value++
      }
      saveCombatants()
    }

    const resetCombat = () => {
      if (confirm(t('resetCombatConfirm'))) {
        combatants.value = []
        round.value = 1
        currentTurn.value = 0
        saveCombatants()
      }
    }

    onMounted(() => {
      loadCombatants()
    })

    return {
      t,
      combatants,
      sortedCombatants,
      round,
      currentTurn,
      newCombatant,
      addCombatant,
      removeCombatant,
      adjustHp,
      addCondition,
      removeCondition,
      nextRound,
      resetCombat
    }
  }
}
</script>
