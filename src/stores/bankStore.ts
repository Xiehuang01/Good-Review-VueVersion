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

  // 模拟考试题目生成
  const generateExamQuestions = (bankId: string): QuestionItem[] => {
    const bank = banks.value.find(b => b.id === bankId)
    if (!bank) return []

    const examQuestions: QuestionItem[] = []
    
    // 按题型分类
    const questionsByType = new Map<string, QuestionItem[]>()
    bank.questions.forEach(q => {
      const type = q.type
      if (!questionsByType.has(type)) {
        questionsByType.set(type, [])
      }
      questionsByType.get(type)!.push(q)
    })

    // 随机抽取题目的辅助函数
    const shuffleArray = <T>(array: T[]): T[] => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // 定义题型顺序：选择题 -> 判断题 -> 填空题
    const typeOrder = [
      { types: ['选择', '单选', '多选'], count: 20 },
      { types: ['判断'], count: 15 },
      { types: ['填空', '简答'], count: 10 }
    ]

    // 按顺序抽取题目
    typeOrder.forEach(({ types, count }) => {
      // 找到匹配的题型
      const matchingQuestions: QuestionItem[] = []
      
      questionsByType.forEach((questions, type) => {
        const isMatchingType = types.some(t => type.includes(t) || type === t)
        if (isMatchingType) {
          matchingQuestions.push(...questions)
        }
      })

      // 如果有匹配的题目，随机抽取指定数量
      if (matchingQuestions.length > 0) {
        const selectedCount = Math.min(count, matchingQuestions.length)
        const selectedQuestions = shuffleArray(matchingQuestions).slice(0, selectedCount)
        examQuestions.push(...selectedQuestions)
      }
    })

    // 不打乱最终顺序，保持题型顺序
    return examQuestions
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
    clearFilteredQuestions,
    generateExamQuestions
  }
}