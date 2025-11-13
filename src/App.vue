<template>
  <div id="app" class="dm-screen">
    <header class="header">
      <h1>🎲 {{ t('dmScreen') }}</h1>
      <div class="api-status">
        <span v-if="geminiApiKey" class="status-badge active">{{ t('aiActive') }}</span>
        <span v-else class="status-badge inactive">{{ t('aiOffline') }}</span>
        <select v-model="currentLanguage" @change="changeLanguage" class="language-selector">
          <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
            {{ lang.flag }} {{ lang.name }}
          </option>
        </select>
        <button @click="showApiKeyModal = true" class="btn-small">⚙️ {{ t('apiKey') }}</button>
      </div>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </nav>

    <main class="content">
      <InitiativeTracker v-if="activeTab === 'initiative'" :geminiApiKey="geminiApiKey" />
      <EncounterBuilder v-if="activeTab === 'encounters'" />
      <NPCGenerator v-if="activeTab === 'npcs'" :geminiApiKey="geminiApiKey" />
      <RandomTables v-if="activeTab === 'inspiration'" />
      <NoteTaker v-if="activeTab === 'notes'" />
    </main>

    <!-- API Key Modal -->
    <div v-if="showApiKeyModal" class="modal-overlay" @click="showApiKeyModal = false">
      <div class="modal" @click.stop>
        <h2>{{ t('apiKeyTitle') }}</h2>
        <p>{{ t('apiKeyInstructions') }} <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
        <input
          v-model="tempApiKey"
          type="password"
          :placeholder="t('apiKeyPlaceholder')"
          class="input"
        >
        <div class="modal-actions">
          <button @click="saveApiKey" class="btn">{{ t('save') }}</button>
          <button @click="showApiKeyModal = false" class="btn btn-secondary">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import InitiativeTracker from './components/InitiativeTracker.vue'
import EncounterBuilder from './components/EncounterBuilder.vue'
import NPCGenerator from './components/NPCGenerator.vue'
import RandomTables from './components/RandomTables.vue'
import NoteTaker from './components/NoteTaker.vue'
import { useI18n } from './composables/useI18n'

export default {
  name: 'App',
  components: {
    InitiativeTracker,
    EncounterBuilder,
    NPCGenerator,
    RandomTables,
    NoteTaker
  },
  setup() {
    const { t, currentLanguage, setLanguage, availableLanguages } = useI18n()

    const activeTab = ref('initiative')
    const geminiApiKey = ref('')
    const showApiKeyModal = ref(false)
    const tempApiKey = ref('')

    const tabs = computed(() => [
      { id: 'initiative', name: t('initiative'), icon: '⚔️' },
      { id: 'encounters', name: t('encounters'), icon: '👹' },
      { id: 'npcs', name: t('npcs'), icon: '🧙' },
      { id: 'inspiration', name: t('inspiration'), icon: '✨' },
      { id: 'notes', name: t('notes'), icon: '📝' }
    ])

    onMounted(() => {
      const savedKey = localStorage.getItem('gemini_api_key')
      if (savedKey) {
        geminiApiKey.value = savedKey
      }
    })

    const saveApiKey = () => {
      if (tempApiKey.value.trim()) {
        geminiApiKey.value = tempApiKey.value.trim()
        localStorage.setItem('gemini_api_key', geminiApiKey.value)
        showApiKeyModal.value = false
        tempApiKey.value = ''
      }
    }

    const changeLanguage = () => {
      setLanguage(currentLanguage.value)
    }

    return {
      t,
      currentLanguage,
      availableLanguages,
      changeLanguage,
      activeTab,
      tabs,
      geminiApiKey,
      showApiKeyModal,
      tempApiKey,
      saveApiKey
    }
  }
}
</script>
