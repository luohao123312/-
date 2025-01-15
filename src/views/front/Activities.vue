<template>
  <div class="activities-container">
    <div class="page-header">
      <el-button type="primary" @click="goBack" plain>
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2>社区活动</h2>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="activity-list">
          <template #header>
            <div class="card-header">
              <span>近期活动</span>
              <el-button type="primary" @click="handleSignup">活动报名</el-button>
            </div>
          </template>
          
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.time"
              placement="top"
            >
              <el-card>
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.content }}</p>
                <p>地点：{{ activity.location }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="interest-groups">
          <template #header>
            <div class="card-header">
              <span>兴趣小组</span>
            </div>
          </template>
          
          <el-menu>
            <el-menu-item v-for="(group, index) in groups" :key="index">
              <span>{{ group.name }}</span>
              <span>{{ group.members }}人</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activities = ref([
  {
    time: '2024-03-20 09:00',
    title: '太极拳教学',
    content: '由专业教练指导太极拳基本动作',
    location: '社区活动中心'
  },
  {
    time: '2024-03-21 14:00',
    title: '棋牌比赛',
    content: '象棋、围棋、麻将等多种棋牌活动',
    location: '棋牌室'
  },
  {
    time: '2024-03-22 15:00',
    title: '手工艺制作',
    content: '剪纸、编织等传统手工艺学习',
    location: '多功能活动室'
  }
])

const groups = ref([
  { name: '太极拳小组', members: 20 },
  { name: '书法小组', members: 15 },
  { name: '合唱小组', members: 25 },
  { name: '园艺小组', members: 18 }
])

const handleSignup = () => {
  ElMessage.success('报名成功！')
}

const goBack = () => {
  router.push('/front/home')
}
</script>

<style scoped>
.activities-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.page-header h2 {
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-list {
  margin-bottom: 20px;
}

.interest-groups .el-menu-item {
  display: flex;
  justify-content: space-between;
}
</style> 