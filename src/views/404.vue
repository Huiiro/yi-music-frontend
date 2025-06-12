<template>
  <div class="empty">
    <el-empty
        :image-size="220"
        :image="notFound"
        description="您访问的页面或资源不存在，即将自动返回首页"
        style="margin-top: 80px"
    >
      <p>如果没有自动返回首页，您也可以点击按钮手动返回</p>
      <el-button @click="goBack">回到首页</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"
import {onActivated, onMounted} from "vue"
import notFound from '@/assets/svg/response/notFound.svg'

const router = useRouter()
const goBack = () => {
  // 回退上级替代回退首页
  // router.replace({path: '/song', replace: true})
  router.back({replace: true})
}

const autoGoBack = () => {
  setTimeout(() => {
    goBack()
  }, 2000)
}

onMounted(() => {
  autoGoBack()
})

// keep-alive 缓存 每次 active 重新触发
onActivated(() => {
  autoGoBack()
})
</script>

<style scoped>
.empty {
  p {
    font: inherit;
    font-size: 14px;
    color: #8f9298;
    margin: 10px 0 20px;
    padding: 0;
    vertical-align: baseline;
    border: 0;
  }
}
</style>