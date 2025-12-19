import { ref, computed } from 'vue'
import type { QuestionBank, QuestionItem } from '@/types/types'
import { DEFAULT_BANKS } from '@/constants/constants'

// 版本号，每次更新题库时递增
const DATA_VERSION = '1.0.1'

// 全局状态
const banks = ref<QuestionBank[]>([])
const filteredQuestions = ref<QuestionItem[] | undefined>(undefined)

// 初始化数据
const initializeBanks = () => {
  const savedVersion = localStorage.getItem('cx_quiz_version')
  const saved = localStorage.getItem('cx_quiz_banks')
  
  // 如果版本不匹配或没有保存的数据，使用默认题库
  if (savedVersion !== DATA_VERSION || !saved) {
    banks.value = DEFAULT_BANKS
    localStorage.setItem('cx_quiz_version', DATA_VERSION)
    return
  }
  
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      banks.value = parsed
    } else {
      banks.value = DEFAULT_BANKS
    }
  } catch (e) {
    console.error("Failed to load banks", e)
    banks.value = DEFAULT_BANKS
  }
}

// 保存到localStorage
const saveBanks = () => {
  if (banks.value.length > 0) {
    localStorage.setItem('cx_quiz_banks', JSON.stringify(banks.value))
  }
}

// Store composable
export function useBankStore() {
  // 计算属性
  const getBankById = computed(() => {
    return (id: string) => banks.value.find(bank => bank.id === id)
  })

  // 方法
  const addBank = (newBank: QuestionBank) => {
    banks.value = [newBank, ...banks.value]
    saveBanks()
  }

  const removeBank = (id: string) => {
    banks.value = banks.value.filter(bank => bank.id !== id)
    saveBanks()
  }

  const setFilteredQuestions = (questions: QuestionItem[]) => {
    filteredQuestions.value = questions
  }

  const clearFilteredQuestions = () => {
    filteredQuestions.value = undefined
  }

  // 初始化（只在第一次调用时执行）
  if (banks.value.length === 0) {
    initializeBanks()
  }

  return {
    // 状态 - 直接返回响应式引用
    banks,
    filteredQuestions,
    
    // 计算属性
    getBankById,
    
    // 方法
    addBank,
    removeBank,
    setFilteredQuestions,
    clearFilteredQuestions
  }
}