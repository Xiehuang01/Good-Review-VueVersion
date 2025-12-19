<template>
  <Importer @import="handleImport" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Importer from '@/components/Importer.vue'
import type { QuestionBank } from '@/types/types'
import { useBankStore } from '../stores/bankStore'

const router = useRouter()
const bankStore = useBankStore()

const handleImport = (newBank: QuestionBank) => {
  bankStore.addBank(newBank)
  // 导入成功后跳转到题库页面
  router.push('/dashboard')
}
</script>