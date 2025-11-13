<template>
  <div class="note-taker">
    <div class="notes-header">
      <h2>📝 {{ t('sessionNotes') }}</h2>
      <button @click="showNewSession = true" class="btn">+ {{ t('newSession') }}</button>
    </div>

    <!-- New Session Modal -->
    <div v-if="showNewSession" class="modal-overlay" @click="showNewSession = false">
      <div class="modal" @click.stop>
        <h3>{{ t('newSession') }}</h3>
        <input
          v-model="newSessionTitle"
          :placeholder="t('sessionTitle')"
          class="input"
          @keyup.enter="createSession"
        >
        <div class="modal-actions">
          <button @click="createSession" class="btn">{{ t('create') }}</button>
          <button @click="showNewSession = false" class="btn btn-secondary">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Sessions List -->
    <div class="sessions-sidebar">
      <div
        v-for="session in sessions"
        :key="session.id"
        @click="selectSession(session)"
        :class="['session-item', { active: currentSession?.id === session.id }]"
      >
        <div class="session-info">
          <h4>{{ session.title }}</h4>
          <span class="session-date">{{ formatDate(session.date) }}</span>
        </div>
        <button @click.stop="deleteSession(session.id)" class="btn-tiny btn-danger">×</button>
      </div>

      <div v-if="sessions.length === 0" class="empty-state">
        <p>{{ t('noSessions') }}</p>
      </div>
    </div>

    <!-- Note Editor -->
    <div v-if="currentSession" class="note-editor">
      <div class="editor-header">
        <h3>{{ currentSession.title }}</h3>
        <span class="auto-save">{{ saveStatus }}</span>
      </div>

      <div class="editor-toolbar">
        <button @click="addSection(t('events'))" class="btn-small">+ {{ t('events') }}</button>
        <button @click="addSection(t('npcsMet'))" class="btn-small">+ {{ t('npcsMet') }}</button>
        <button @click="addSection(t('locations'))" class="btn-small">+ {{ t('locations') }}</button>
        <button @click="addSection(t('quests'))" class="btn-small">+ {{ t('quests') }}</button>
        <button @click="addSection(t('loot'))" class="btn-small">+ {{ t('loot') }}</button>
        <button @click="addSection(t('notes'))" class="btn-small">+ {{ t('notes') }}</button>
      </div>

      <div class="sections">
        <div v-for="(section, index) in currentSession.sections" :key="index" class="section">
          <div class="section-header">
            <input
              v-model="section.title"
              class="section-title-input"
              @input="autoSave"
            >
            <button @click="removeSection(index)" class="btn-tiny">{{ t('remove') }}</button>
          </div>
          <textarea
            v-model="section.content"
            class="section-textarea"
            :placeholder="`Enter ${section.title.toLowerCase()} here...`"
            @input="autoSave"
            rows="6"
          ></textarea>
        </div>
      </div>

      <!-- Quick Notes -->
      <div class="quick-notes">
        <h4>{{ t('quickNotes') }}</h4>
        <div class="quick-notes-list">
          <div v-for="(note, index) in currentSession.quickNotes" :key="index" class="quick-note">
            <span>{{ note.timestamp }} - {{ note.text }}</span>
            <button @click="removeQuickNote(index)" class="btn-tiny">×</button>
          </div>
        </div>
        <div class="quick-note-input">
          <input
            v-model="quickNoteText"
            :placeholder="t('quickNotePlaceholder')"
            class="input"
            @keyup.enter="addQuickNote"
          >
          <button @click="addQuickNote" class="btn-small">{{ t('add') }}</button>
        </div>
      </div>
    </div>

    <div v-else class="no-session-selected">
      <p>{{ t('selectSession') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'NoteTaker',
  setup() {
    const { t } = useI18n()

    const sessions = ref([])
    const currentSession = ref(null)
    const showNewSession = ref(false)
    const newSessionTitle = ref('')
    const saveStatus = ref('')
    const quickNoteText = ref('')
    let saveTimeout = null

    const loadSessions = () => {
      const saved = localStorage.getItem('session_notes')
      if (saved) {
        sessions.value = JSON.parse(saved)
      }
    }

    const saveSessions = () => {
      localStorage.setItem('session_notes', JSON.stringify(sessions.value))
      saveStatus.value = t('allChangesSaved')
    }

    const autoSave = () => {
      saveStatus.value = t('saving')
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        saveSessions()
      }, 1000)
    }

    const createSession = () => {
      if (newSessionTitle.value.trim()) {
        const newSession = {
          id: Date.now(),
          title: newSessionTitle.value,
          date: new Date().toISOString(),
          sections: [
            { title: t('sessionSummary'), content: '' },
            { title: t('events'), content: '' },
            { title: t('npcsMet'), content: '' },
            { title: t('quests'), content: '' }
          ],
          quickNotes: []
        }
        sessions.value.unshift(newSession)
        currentSession.value = newSession
        newSessionTitle.value = ''
        showNewSession.value = false
        saveSessions()
      }
    }

    const selectSession = (session) => {
      currentSession.value = session
      saveStatus.value = t('allChangesSaved')
    }

    const deleteSession = (id) => {
      if (confirm(t('deleteSessionConfirm'))) {
        sessions.value = sessions.value.filter(s => s.id !== id)
        if (currentSession.value?.id === id) {
          currentSession.value = null
        }
        saveSessions()
      }
    }

    const addSection = (title) => {
      if (currentSession.value) {
        currentSession.value.sections.push({
          title,
          content: ''
        })
        autoSave()
      }
    }

    const removeSection = (index) => {
      if (currentSession.value) {
        currentSession.value.sections.splice(index, 1)
        autoSave()
      }
    }

    const addQuickNote = () => {
      if (quickNoteText.value.trim() && currentSession.value) {
        const timestamp = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
        currentSession.value.quickNotes.push({
          timestamp,
          text: quickNoteText.value.trim()
        })
        quickNoteText.value = ''
        autoSave()
      }
    }

    const removeQuickNote = (index) => {
      if (currentSession.value) {
        currentSession.value.quickNotes.splice(index, 1)
        autoSave()
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      loadSessions()
      saveStatus.value = t('allChangesSaved')
    })

    return {
      t,
      sessions,
      currentSession,
      showNewSession,
      newSessionTitle,
      saveStatus,
      quickNoteText,
      createSession,
      selectSession,
      deleteSession,
      addSection,
      removeSection,
      addQuickNote,
      removeQuickNote,
      formatDate,
      autoSave
    }
  }
}
</script>
