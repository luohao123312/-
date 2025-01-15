<template>
  <div class="health-container">
    <div class="page-header">
      <el-button type="primary" @click="goBack" plain>
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2>健康管理</h2>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="health-card">
          <template #header>
            <div class="card-header">
              <span>健康档案</span>
            </div>
          </template>
          <div class="health-data">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="血压">120/80 mmHg</el-descriptions-item>
              <el-descriptions-item label="血糖">5.6 mmol/L</el-descriptions-item>
              <el-descriptions-item label="体温">36.5 ℃</el-descriptions-item>
              <el-descriptions-item label="心率">75 次/分</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="health-card">
          <template #header>
            <div class="card-header">
              <span>用药提醒</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="08:00" placement="top">
              <el-card>
                <h4>早餐后服用降压药</h4>
                <p>请按时服用医生开具的药物</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="12:00" placement="top">
              <el-card>
                <h4>午餐后服用降糖药</h4>
                <p>请按时服用医生开具的药物</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="health-card">
          <template #header>
            <div class="card-header">
              <span>预约服务</span>
            </div>
          </template>
          <div class="appointment-list">
            <el-button type="primary" @click="handleAppointment('体检')">预约体检</el-button>
            <el-button type="primary" @click="handleAppointment('问诊')">预约问诊</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleAppointment = (type) => {
  ElMessage.success(`预约${type}服务成功！`)
}

const goBack = () => {
  router.push('/front/home')
}
</script>

<style scoped>
.health-container {
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

.health-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-data {
  margin: 20px 0;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.appointment-list .el-button {
  width: 100%;
}
</style> 