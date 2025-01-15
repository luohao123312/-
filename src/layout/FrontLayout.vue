<template>
  <div class="front-layout">
    <div class="header">
      <div class="logo">社区养老护老服务平台</div>
      <div class="nav-right">
        <el-button type="primary" plain @click="goToAdmin">
          <el-icon><Back /></el-icon>进入后台
        </el-button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.roles.includes('admin')
})

const goToAdmin = () => {
  router.push('/login')
}
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style> 