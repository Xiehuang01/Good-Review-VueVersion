<template>
  <div v-if="bank">
    <QuizPlayer 
      :key="`${bank.id}-${filteredQuestions ? 'filtered' : 'all'}-${Date.now()}`"
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
import QuizPlayer from '@/components/QuizPlayer.vue'
import { useBankStore } from '../stores/bankStore'

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