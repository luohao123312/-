<template>
  <div class="service-booking">
    <div class="page-header">
      <el-button type="primary" @click="goBack" plain>
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2>服务预约</h2>
    </div>
    
    <!-- 服务类型选择 -->
    <el-tabs v-model="activeTab" class="service-tabs">
      <el-tab-pane label="居家照护" name="home">
        <el-row :gutter="20">
          <el-col :span="8" v-for="service in homeServices" :key="service.id">
            <el-card class="service-card">
              <template #header>
                <div class="card-header">
                  <span>{{ service.name }}</span>
                  <el-tag size="small">{{ service.price }}元/次</el-tag>
                </div>
              </template>
              <p>{{ service.description }}</p>
              <el-button type="primary" @click="handleBooking(service)" block>立即预约</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="医疗保健" name="medical">
        <el-row :gutter="20">
          <el-col :span="8" v-for="service in medicalServices" :key="service.id">
            <el-card class="service-card">
              <template #header>
                <div class="card-header">
                  <span>{{ service.name }}</span>
                  <el-tag size="small">{{ service.price }}元/次</el-tag>
                </div>
              </template>
              <p>{{ service.description }}</p>
              <el-button type="primary" @click="handleBooking(service)" block>立即预约</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="生活服务" name="life">
        <el-row :gutter="20">
          <el-col :span="8" v-for="service in lifeServices" :key="service.id">
            <el-card class="service-card">
              <template #header>
                <div class="card-header">
                  <span>{{ service.name }}</span>
                  <el-tag size="small">{{ service.price }}元/次</el-tag>
                </div>
              </template>
              <p>{{ service.description }}</p>
              <el-button type="primary" @click="handleBooking(service)" block>立即预约</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 预约表单 -->
    <el-dialog v-model="showBooking" title="服务预约" width="500px">
      <el-form :model="bookingForm" label-width="100px" :rules="rules" ref="bookingFormRef">
        <el-form-item label="预约时间" prop="date">
          <el-date-picker
            v-model="bookingForm.date"
            type="datetime"
            placeholder="选择预约时间"
            :disabled-date="disabledDate"
            :disabled-time="disabledTime"
          />
        </el-form-item>
        <el-form-item label="服务项目">
          <el-input v-model="bookingForm.serviceName" disabled />
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input
            v-model="bookingForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入特殊需求或注意事项"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBooking = false">取消</el-button>
        <el-button type="primary" @click="submitBooking">确认预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { addPlan } from '@/api/nursing/plan'
import { listProject } from '@/api/nursing/project'

const router = useRouter()
const activeTab = ref('home')
const showBooking = ref(false)
const bookingFormRef = ref(null)

const bookingForm = ref({
  date: '',
  serviceName: '',
  remark: '',
  price: 0,
  projectId: null
})

const rules = {
  date: [{ required: true, message: '请选择预约时间', trigger: 'change' }],
  remark: [{ max: 200, message: '备注不能超过200字', trigger: 'blur' }]
}

const homeServices = ref([])
const medicalServices = ref([])
const lifeServices = ref([])

// 获取服务项目数据
const getServiceList = async () => {
  try {
    const response = await listProject()
    if (!response.rows || !Array.isArray(response.rows)) {
      throw new Error('数据格式错误')
    }
    
    // 清空现有数据
    homeServices.value = []
    medicalServices.value = []
    lifeServices.value = []
    
    // 根据服务类型分类
    response.rows.forEach(service => {
      const serviceItem = {
        id: service.id,
        projectId: service.id,
        name: service.name,
        price: service.price,
        description: service.remark || service.nursingRequirement || '暂无描述'
      }
      
      // 根据项目类型分类
      if (service.type === 1 || service.id <= 3) {
        homeServices.value.push(serviceItem)
      } else if (service.type === 2 || (service.id > 3 && service.id <= 6)) {
        medicalServices.value.push(serviceItem)
      } else {
        lifeServices.value.push(serviceItem)
      }
    })
  } catch (error) {
    console.error('获取服务项目失败:', error)
    ElMessage.error('获取服务项目失败，请刷新重试')
  }
}

const submitBooking = async () => {
  if (!bookingFormRef.value) return
  
  try {
    await bookingFormRef.value.validate()
    const now = new Date()
    const executeDate = new Date(bookingForm.value.date)
    const planData = {
      planId: generatePlanId(), // 使用6位随机数作为planId
      projectId: bookingForm.value.projectId,
      executeTime: formatDate(executeDate),
      executeCycle: 0, // 默认按天
      executeFrequency: 1, // 默认一次
      remark: bookingForm.value.remark,
      createBy: null,
      createTime: formatDate(now),
      updateTime: formatDate(now)
    }
    await addPlan(planData)
    ElMessage.success('预约成功')
    showBooking.value = false
    // 重置表单
    bookingForm.value = {
      date: '',
      serviceName: '',
      remark: '',
      price: 0,
      projectId: null
    }
  } catch (error) {
    console.error('预约失败:', error)
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('预约失败，请重试')
    }
  }
}

onMounted(() => {
  getServiceList()
})

const handleBooking = (service) => {
  bookingForm.value = {
    date: '',
    serviceName: service.name,
    remark: '',
    price: service.price,
    projectId: service.projectId
  }
  showBooking.value = true
}

const goBack = () => {
  router.push('/front/home')
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

const disabledTime = (date) => {
  return {
    hours: () => [0, 1, 2, 3, 4, 5, 6, 22, 23],
  }
}

const formatDate = (date) => {
  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const generatePlanId = () => {
  // 生成6位随机数
  return Math.floor(100000 + Math.random() * 900000)
}
</script>

<style scoped>
.service-booking {
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

.service-tabs {
  margin-top: 20px;
}

.service-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-card p {
  margin: 15px 0;
  color: #666;
  min-height: 40px;
}
</style> 