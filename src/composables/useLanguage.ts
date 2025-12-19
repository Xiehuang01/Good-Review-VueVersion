import { ref, provide, inject, type InjectionKey, type Ref } from 'vue'
import { translations, type Language } from '../constants/translations'

interface LanguageContext {
  language: Ref<Language>
  setLanguage: (lang: Language) => void
  t: (path: string) => string
}

const LanguageKey: InjectionKey<LanguageContext> = Symbol('language')

export function provideLanguage() {
  const language = ref<Language>('cn') // Default to Chinese for Chaoxing users

  const setLanguage = (lang: Language) => {
    language.value = lang
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let current: any = translations[language.value]
    for (const key of keys) {
      if (current[key] === undefined) return path
      current = current[key]
    }
    return current as string
  }

  const context = {
    language,
    setLanguage,
    t
  }

  provide(LanguageKey, context)
  return context
}

export function useLanguage() {
  const context = inject(LanguageKey)
  if (!context) {
    throw new Error('useLanguage must be used within a component that provides language context')
  }
  return context
}