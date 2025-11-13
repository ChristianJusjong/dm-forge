import { ref, computed } from 'vue'
import { translations } from '../i18n/translations'

const currentLanguage = ref('en')

// Load saved language preference
const savedLang = localStorage.getItem('language')
if (savedLang && translations[savedLang]) {
  currentLanguage.value = savedLang
}

export function useI18n() {
  const t = (key) => {
    return translations[currentLanguage.value]?.[key] || key
  }

  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
    }
  }

  const availableLanguages = computed(() => {
    return [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' }
    ]
  })

  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages
  }
}
