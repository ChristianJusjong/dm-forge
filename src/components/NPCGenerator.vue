<template>
  <div class="npc-generator">
    <div class="generator-header">
      <h2>🧙 {{ t('npcGenerator') }}</h2>
    </div>

    <div class="generator-form">
      <div class="form-group">
        <label>{{ t('npcType') }}</label>
        <input
          v-model="npcPrompt"
          :placeholder="t('npcTypePlaceholder')"
          class="input"
        >
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>{{ t('race') }}</label>
          <select v-model="npcRace" class="input">
            <option value="">{{ t('any') }}</option>
            <option value="Human">{{ t('human') }}</option>
            <option value="Elf">{{ t('elf') }}</option>
            <option value="Dwarf">{{ t('dwarf') }}</option>
            <option value="Halfling">{{ t('halfling') }}</option>
            <option value="Dragonborn">{{ t('dragonborn') }}</option>
            <option value="Gnome">{{ t('gnome') }}</option>
            <option value="Half-Elf">{{ t('halfElf') }}</option>
            <option value="Half-Orc">{{ t('halfOrc') }}</option>
            <option value="Tiefling">{{ t('tiefling') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ t('setting') }}</label>
          <input
            v-model="setting"
            :placeholder="t('settingPlaceholder')"
            class="input"
          >
        </div>
      </div>

      <button
        @click="generateNPC"
        :disabled="loading || !geminiApiKey"
        class="btn btn-large"
      >
        {{ loading ? t('generating') : t('generateNPC') }}
      </button>

      <p v-if="!geminiApiKey" class="warning">
        {{ t('apiKeyWarning') }}
      </p>
    </div>

    <!-- Generated NPC Display -->
    <div v-if="generatedNPC" class="npc-display">
      <div class="npc-header">
        <h3>{{ generatedNPC.name }}</h3>
        <button @click="saveNPC" class="btn-small">{{ t('saveNPC') }}</button>
      </div>
      <div class="npc-content" v-html="formatNPC(generatedNPC.content)"></div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Saved NPCs -->
    <div v-if="savedNPCs.length" class="saved-npcs">
      <h3>{{ t('savedNPCs') }}</h3>
      <div class="npcs-grid">
        <div
          v-for="npc in savedNPCs"
          :key="npc.id"
          class="npc-card"
          @click="viewNPC(npc)"
        >
          <div class="npc-card-header">
            <h4>{{ npc.name }}</h4>
            <button @click.stop="deleteNPC(npc.id)" class="btn-tiny btn-danger">{{ t('delete') }}</button>
          </div>
          <p class="npc-preview">{{ npc.preview }}</p>
        </div>
      </div>
    </div>

    <!-- View NPC Modal -->
    <div v-if="viewingNPC" class="modal-overlay" @click="viewingNPC = null">
      <div class="modal large" @click.stop>
        <h3>{{ viewingNPC.name }}</h3>
        <div class="npc-content" v-html="formatNPC(viewingNPC.content)"></div>
        <button @click="viewingNPC = null" class="btn">{{ t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'NPCGenerator',
  props: {
    geminiApiKey: String
  },
  setup(props) {
    const { t } = useI18n()
    const npcPrompt = ref('')
    const npcRace = ref('')
    const setting = ref('')
    const loading = ref(false)
    const error = ref('')
    const generatedNPC = ref(null)
    const savedNPCs = ref([])
    const viewingNPC = ref(null)

    const generateNPC = async () => {
      if (!props.geminiApiKey) {
        error.value = t('apiKeyWarning')
        return
      }

      loading.value = true
      error.value = ''
      generatedNPC.value = null

      try {
        const prompt = `Generate a detailed D&D 5e NPC with the following specifications:
${npcPrompt.value ? `Role/Type: ${npcPrompt.value}` : ''}
${npcRace.value ? `Race: ${npcRace.value}` : ''}
${setting.value ? `Setting: ${setting.value}` : ''}

Please provide:
1. Name
2. Physical appearance
3. Personality traits and mannerisms
4. Background/backstory (brief)
5. Motivation/goals
6. A memorable quirk or secret
7. Key stats (HP, AC, notable abilities if combat-relevant)
8. Potential plot hooks for the DM

Format as clear sections. Be creative and specific!`

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${props.geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }]
            })
          }
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.candidates[0].content.parts[0].text

        // Extract name from content
        const nameMatch = content.match(/(?:Name|NPC Name):\s*\*?\*?([^\n*]+)\*?\*?/i)
        const name = nameMatch ? nameMatch[1].trim() : 'Generated NPC'

        generatedNPC.value = {
          name,
          content,
          timestamp: Date.now()
        }
      } catch (err) {
        error.value = `${t('generateError')} ${err.message}`
      } finally {
        loading.value = false
      }
    }

    const formatNPC = (content) => {
      return content
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
    }

    const saveNPC = () => {
      if (generatedNPC.value) {
        const preview = generatedNPC.value.content.substring(0, 100).replace(/[*#]/g, '')
        savedNPCs.value.unshift({
          id: Date.now(),
          name: generatedNPC.value.name,
          content: generatedNPC.value.content,
          preview,
          timestamp: generatedNPC.value.timestamp
        })
        localStorage.setItem('saved_npcs', JSON.stringify(savedNPCs.value))
        alert(t('npcSaved'))
      }
    }

    const deleteNPC = (id) => {
      if (confirm(t('deleteNPCConfirm'))) {
        savedNPCs.value = savedNPCs.value.filter(n => n.id !== id)
        localStorage.setItem('saved_npcs', JSON.stringify(savedNPCs.value))
      }
    }

    const viewNPC = (npc) => {
      viewingNPC.value = npc
    }

    const loadSavedNPCs = () => {
      const saved = localStorage.getItem('saved_npcs')
      if (saved) {
        savedNPCs.value = JSON.parse(saved)
      }
    }

    onMounted(() => {
      loadSavedNPCs()
    })

    return {
      t,
      npcPrompt,
      npcRace,
      setting,
      loading,
      error,
      generatedNPC,
      savedNPCs,
      viewingNPC,
      generateNPC,
      formatNPC,
      saveNPC,
      deleteNPC,
      viewNPC
    }
  }
}
</script>
