<template>
  <div class="encounter-builder">
    <div class="encounter-header">
      <h2>👹 {{ t('encounterBuilder') }}</h2>
      <button @click="showNewEncounter = true" class="btn">+ {{ t('newEncounter') }}</button>
    </div>

    <!-- Create New Encounter Modal -->
    <div v-if="showNewEncounter" class="modal-overlay" @click="showNewEncounter = false">
      <div class="modal" @click.stop>
        <h3>{{ t('createNewEncounter') }}</h3>
        <input
          v-model="newEncounter.name"
          :placeholder="t('encounterName')"
          class="input"
          @keyup.enter="createEncounter"
        >
        <textarea
          v-model="newEncounter.description"
          :placeholder="t('descriptionOptional')"
          class="textarea"
          rows="3"
        ></textarea>
        <div class="modal-actions">
          <button @click="createEncounter" class="btn">{{ t('create') }}</button>
          <button @click="showNewEncounter = false" class="btn btn-secondary">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Encounters List -->
    <div class="encounters-list">
      <div
        v-for="encounter in encounters"
        :key="encounter.id"
        class="encounter-card"
      >
        <div class="encounter-info">
          <h3>{{ encounter.name }}</h3>
          <p v-if="encounter.description" class="description">{{ encounter.description }}</p>
          <div class="encounter-stats">
            <span>{{ t('creatures') }}: {{ encounter.creatures.length }}</span>
            <span v-if="encounter.creatures.length">{{ t('totalCR') }}: {{ calculateTotalCR(encounter) }}</span>
          </div>
        </div>

        <div class="encounter-actions">
          <button @click="editEncounter(encounter)" class="btn-small">{{ t('edit') }}</button>
          <button @click="loadToInitiative(encounter)" class="btn-small">{{ t('loadToInitiative') }}</button>
          <button @click="deleteEncounter(encounter.id)" class="btn-small btn-danger">{{ t('delete') }}</button>
        </div>

        <!-- Creatures in Encounter -->
        <div v-if="encounter.creatures.length" class="creatures-list">
          <div
            v-for="(creature, index) in encounter.creatures"
            :key="index"
            class="creature-item"
          >
            <div class="creature-info">
              <span class="creature-name">{{ creature.name }}</span>
              <span class="creature-stat">{{ t('hp') }}: {{ creature.hp }}</span>
              <span class="creature-stat">{{ t('ac') }}: {{ creature.ac }}</span>
              <span class="creature-stat">{{ t('cr') }}: {{ creature.cr || 0 }}</span>
            </div>
            <button @click="removeCreature(encounter, index)" class="btn-tiny">{{ t('remove') }}</button>
          </div>
        </div>

        <!-- Add Creature Form -->
        <div v-if="editingEncounterId === encounter.id" class="add-creature-form">
          <input v-model="newCreature.name" :placeholder="t('creatureName')" class="input">
          <input v-model.number="newCreature.hp" type="number" :placeholder="t('hp')" class="input short">
          <input v-model.number="newCreature.ac" type="number" :placeholder="t('ac')" class="input short">
          <input v-model.number="newCreature.cr" type="number" :placeholder="t('cr')" class="input short" step="0.125">
          <input v-model.number="newCreature.count" type="number" :placeholder="t('count')" class="input short" min="1">
          <button @click="addCreature(encounter)" class="btn-small">{{ t('add') }}</button>
        </div>
      </div>

      <div v-if="encounters.length === 0" class="empty-state">
        <p>{{ t('noEncounters') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'EncounterBuilder',
  setup() {
    const { t } = useI18n()
    const encounters = ref([])
    const showNewEncounter = ref(false)
    const editingEncounterId = ref(null)
    const newEncounter = ref({
      name: '',
      description: ''
    })
    const newCreature = ref({
      name: '',
      hp: 10,
      ac: 10,
      cr: 0,
      count: 1
    })

    const loadEncounters = () => {
      const saved = localStorage.getItem('encounters')
      if (saved) {
        encounters.value = JSON.parse(saved)
      }
    }

    const saveEncounters = () => {
      localStorage.setItem('encounters', JSON.stringify(encounters.value))
    }

    const createEncounter = () => {
      if (newEncounter.value.name.trim()) {
        encounters.value.push({
          id: Date.now(),
          name: newEncounter.value.name,
          description: newEncounter.value.description,
          creatures: []
        })
        newEncounter.value = { name: '', description: '' }
        showNewEncounter.value = false
        saveEncounters()
      }
    }

    const deleteEncounter = (id) => {
      if (confirm(t('deleteEncounterConfirm'))) {
        encounters.value = encounters.value.filter(e => e.id !== id)
        saveEncounters()
      }
    }

    const editEncounter = (encounter) => {
      editingEncounterId.value = editingEncounterId.value === encounter.id ? null : encounter.id
    }

    const addCreature = (encounter) => {
      if (newCreature.value.name.trim()) {
        const count = newCreature.value.count || 1
        for (let i = 0; i < count; i++) {
          const suffix = count > 1 ? ` ${i + 1}` : ''
          encounter.creatures.push({
            name: newCreature.value.name + suffix,
            hp: newCreature.value.hp || 10,
            ac: newCreature.value.ac || 10,
            cr: newCreature.value.cr || 0
          })
        }
        newCreature.value = { name: '', hp: 10, ac: 10, cr: 0, count: 1 }
        saveEncounters()
      }
    }

    const removeCreature = (encounter, index) => {
      encounter.creatures.splice(index, 1)
      saveEncounters()
    }

    const calculateTotalCR = (encounter) => {
      return encounter.creatures.reduce((sum, c) => sum + (c.cr || 0), 0).toFixed(2)
    }

    const loadToInitiative = (encounter) => {
      const initiativeData = localStorage.getItem('initiative_tracker')
      let data = initiativeData ? JSON.parse(initiativeData) : { combatants: [], round: 1, currentTurn: 0 }

      encounter.creatures.forEach(creature => {
        data.combatants.push({
          id: Date.now() + Math.random(),
          name: creature.name,
          initiative: 10,
          hp: creature.hp,
          maxHp: creature.hp,
          ac: creature.ac,
          conditions: [],
          newCondition: ''
        })
      })

      localStorage.setItem('initiative_tracker', JSON.stringify(data))
      alert(`${encounter.creatures.length} ${t('creaturesLoaded')}`)
    }

    onMounted(() => {
      loadEncounters()
    })

    return {
      t,
      encounters,
      showNewEncounter,
      editingEncounterId,
      newEncounter,
      newCreature,
      createEncounter,
      deleteEncounter,
      editEncounter,
      addCreature,
      removeCreature,
      calculateTotalCR,
      loadToInitiative
    }
  }
}
</script>
