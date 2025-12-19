<template>
  <BankDashboard 
    :banks="bankStore.banks.value" 
    @delete="handleRequestDelete" 
    @start="handleStartQuiz" 
  />

  <!-- Delete Confirmation Modal -->
  <Teleport to="body">
    <div 
      v-if="deleteTargetId" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in" 
      @click="deleteTargetId = null"
    >
      <div 
        class="glass-panel-modal rounded-3xl p-8 max-w-sm w-full transform transition-all scale-100"
        @click.stop
      >
        <div class="flex items-center gap-4 mb-4 text-red-600">
           <div class="w-12 h-12 rounded-full bg-red-100/50 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <AlertTriangle :size="24" />
           </div>
           <h3 class="text-xl font-bold text-slate-800">{{ t('dashboard.deleteConfirmTitle') }}</h3>
        </div>
        
        <p class="text-slate-600 mb-8 font-medium">
          {{ t('dashboard.deleteConfirm') }}
        </p>
        
        <div class="flex gap-3 justify-end">
          <button 
            @click="deleteTargetId = null"
            class="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100/50 font-bold transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="confirmDelete"
            class="px-6 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 backdrop-blur-sm transition-all"
          >
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle } from 'lucide-vue-next'
import BankDashboard from '@/components/BankDashboard.vue'
import type { QuestionItem } from '@/types/types'
import { useBankStore } from '../stores/bankStore'
import { useLanguage } from '@/composables/useLanguage'

const router = useRouter()
const bankStore = useBankStore()
const { t } = useLanguage()

const deleteTargetId = ref<string | null>(null)

const handleRequestDelete = (id: string) => {
  deleteTargetId.value = id
}

const confirmDelete = () => {
  if (deleteTargetId.value) {
    bankStore.removeBank(deleteTargetId.value)
    deleteTargetId.value = null
  }
}

const handleStartQuiz = (id: string, selectedQuestions?: QuestionItem[]) => {
  // 设置选中的题目到store
  if (selectedQuestions) {
    bankStore.setFilteredQuestions(selectedQuestions)
  } else {
    bankStore.clearFilteredQuestions()
  }
  
  // 跳转到答题页面
  router.push(`/quiz/${id}`)
}
</script>