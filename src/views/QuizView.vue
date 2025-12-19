<template>
  <div v-if="bank">
    <!-- Exam Mode Header -->
    <div v-if="isExamMode" class="max-w-4xl mx-auto mb-6">
      <div class="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
            <FileText :size="20" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800">模拟考试模式</h3>
            <p class="text-sm text-slate-600">{{ filteredQuestions?.length || 0 }} 题随机抽取</p>
          </div>
        </div>
        <div class="text-sm font-bold text-purple-600 bg-purple-100/50 px-3 py-1 rounded-lg">
          EXAM
        </div>
      </div>
    </div>

    <QuizPlayer 
      :key="`${bank.id}-${isExamMode ? 'exam' : (filteredQuestions ? 'filtered' : 'all')}-${Date.now()}`"
      :bank="bank" 
      :initial-questions="filteredQuestions"
      @exit="handleExit" 
    />
  </div>
  <div v-else class="text-center py-20">
    <div class="glass-panel rounded-3xl p-8 max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">题库未找到</h2>
      <p class="text-slate-600 mb-6">请检查题库是否存在或返回题库列表。</p>
      <button 
        @click="$router.push('/dashboard')"
        class="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all"
      >
        返回题库
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FileText } from 'lucide-vue-next'
import QuizPlayer from '@/components/QuizPlayer.vue'
import { useBankStore } from '../stores/bankStore'

interface Props {
  isExamMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExamMode: false
})

const router = useRouter()
const route = useRoute()
const bankStore = useBankStore()

// 从路由参数获取题库ID
const bankId = computed(() => route.params.bankId as string)

// 获取当前题库
const bank = computed(() => bankStore.getBankById.value(bankId.value))

// 获取筛选的题目
const filteredQuestions = computed(() => bankStore.filteredQuestions.value)

const handleExit = () => {
  // 清除筛选的题目
  bankStore.clearFilteredQuestions()
  // 返回题库页面
  router.push('/dashboard')
}

// 如果题库不存在，自动跳转到题库页面
if (!bank.value) {
  router.replace('/dashboard')
}
</script>