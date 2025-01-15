<template>
  <div class="home">
    <!-- 顶部导航 -->
    <el-menu mode="horizontal" :router="true" class="nav-menu" :ellipsis="false">
      <el-menu-item index="/front/home">首页</el-menu-item>
      <el-menu-item index="/front/service">服务预约</el-menu-item>
      <el-menu-item index="/front/health">健康管理</el-menu-item>
      <el-menu-item index="/front/activities">社区活动</el-menu-item>
      <div class="flex-grow" />
    </el-menu>

    <!-- 轮播图 -->
    <el-carousel height="900px" class="banner" width="100%">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <div class="banner-content">
          <img :src="item.imageUrl" :alt="item.title">
          <div class="banner-text">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 服务项目展示 -->
    <div class="service-section">
      <h2 class="section-title">特色服务</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(service, index) in services" :key="index">
          <el-card class="service-card" shadow="hover">
            <img :src="service.icon" class="service-icon">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <el-button type="primary" link @click="goToService">了解更多</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 健康资讯 -->
    <div class="news-section">
      <h2 class="section-title">健康资讯</h2>
      <el-row :gutter="20">
        <el-col :span="8" v-for="(news, index) in healthNews" :key="index">
          <el-card class="news-card" shadow="hover">
            <img :src="news.image" class="news-image">
            <div class="news-content">
              <h3>{{ news.title }}</h3>
              <p>{{ news.summary }}</p>
              <div class="news-footer">
                <span>{{ news.date }}</span>
                <el-button type="primary" link @click="viewNewsDetail(news)">查看详情</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 社区动态 -->
    <div class="community-section">
      <h2 class="section-title">社区动态</h2>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="notice-card">
            <template #header>
              <div class="card-header">
                <span>最新公告</span>
                <el-button type="primary" link @click="viewMoreNotices">查看更多</el-button>
              </div>
            </template>
            <ul class="notice-list">
              <li v-for="(notice, index) in notices" :key="index" @click="viewNoticeDetail(notice)">
                <span class="notice-title">{{ notice.title }}</span>
                <span class="notice-date">{{ notice.date }}</span>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="activity-card">
            <template #header>
              <div class="card-header">
                <span>近期活动</span>
                <el-button type="primary" link @click="goToActivities">更多活动</el-button>
              </div>
            </template>
            <ul class="activity-list">
              <li v-for="(activity, index) in recentActivities" :key="index">
                <div class="activity-info">
                  <span class="activity-title">{{ activity.title }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
                <el-tag size="small" :type="activity.status === '报名中' ? 'success' : 'info'">
                  {{ activity.status }}
                </el-tag>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 紧急求助按钮 -->
    <el-button 
      type="danger" 
      size="large" 
      class="sos-button"
      @click="handleEmergency"
    >
      <el-icon class="sos-icon"><Warning /></el-icon>
      紧急求助
    </el-button>

    <!-- 紧急求助对话框 -->
    <el-dialog
      v-model="emergencyDialogVisible"
      title="紧急求助"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="emergency-content">
        <p class="emergency-message">已发送紧急求助信号，工作人员将立即与您联系！</p>
        <div class="emergency-info">
          <p><el-icon><Timer /></el-icon> 预计响应时间：2-5分钟</p>
          <p><el-icon><Phone /></el-icon> 紧急联系电话：120 / 110</p>
        </div>
        <div class="emergency-actions">
          <el-button type="primary" @click="cancelEmergency">取消求助</el-button>
          <el-button type="danger" @click="callEmergency">直接拨打120</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 公告详情对话框 -->
    <el-dialog
      v-model="noticeDialogVisible"
      :title="currentNotice.title"
      width="600px"
    >
      <div class="notice-detail">
        <p class="notice-content">{{ currentNotice.content || '暂无详细内容' }}</p>
        <div class="notice-info">
          <span>发布时间：{{ currentNotice.date }}</span>
        </div>
      </div>
    </el-dialog>

    <!-- 公告列表对话框 -->
    <el-dialog
      v-model="noticeListDialogVisible"
      title="全部公告"
      width="800px"
    >
      <el-table :data="allNotices" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="date" label="发布时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="viewNoticeDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 健康资讯详情对话框 -->
    <el-dialog
      v-model="newsDialogVisible"
      :title="currentNews.title"
      width="800px"
    >
      <div class="news-detail">
        <img :src="currentNews.image" class="news-detail-image">
        <div class="news-detail-content">
          <p class="news-detail-summary">{{ currentNews.summary }}</p>
          <div class="news-detail-text">{{ currentNews.content }}</div>
          <div class="news-detail-info">
            <span>发布时间：{{ currentNews.date }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Warning, Timer, Phone } from '@element-plus/icons-vue'
import { getListElder } from '@/api/echarts'
import { listProject } from '@/api/nursing/project'

const router = useRouter()
const services = ref([])
const isLogin = ref(false)
const emergencyDialogVisible = ref(false)
const noticeDialogVisible = ref(false)
const noticeListDialogVisible = ref(false)
const currentNotice = ref({})
const newsDialogVisible = ref(false)
const currentNews = ref({})

const bannerList = ref([
  {
    imageUrl: 'https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg',
    title: '温馨舒适的生活环境',
    description: '为老年人提供安全、舒适的居住环境'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/7551623/pexels-photo-7551623.jpeg',
    title: '专业的医疗保健服务',
    description: '24小时专业医护人员待命，保障健康所需'
  },
  {
    imageUrl: 'src/views/1.jpg',
    title: '贴心的生活照料',
    description: '提供专业的生活照料服务，让生活更轻松'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/7551435/pexels-photo-7551435.jpeg',
    title: '丰富的文娱活动',
    description: '组织丰富多彩的文娱活动，让晚年生活更精彩'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1719785045990-135c452bf39d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '营养均衡的膳食',
    description: '专业营养师配餐，确保营养均衡健康'
  },
  {
    imageUrl: 'https://plus.unsplash.com/premium_photo-1663040459049-24d2e044d414?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '康复理疗服务',
    description: '专业的康复理疗团队，帮助恢复身体机能'
  }
])

const healthNews = ref([
  {
    title: '老年人营养膳食指南',
    summary: '专业营养师为您解读老年人饮食注意事项',
    content: `1. 均衡饮食：每天的饮食要包含谷物、蔬菜、水果、肉类、蛋奶类等多种食物。
2. 适量蛋白：每天摄入适量的优质蛋白，如瘦肉、鱼、蛋、奶制品等。
3. 控制盐分：每天食盐摄入量不超过6克，预防高血压。
4. 补充钙质：多吃含钙丰富的食物，如牛奶、酸奶、小鱼干等。
5. 多喝水：每天喝够1500-1700毫升水，保持身体水分。
6. 定时定量：养成规律饮食习惯，不要暴饮暴食。`,
    image: 'https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg',
    date: '2024-03-15'
  },
  {
    title: '春季养生小贴士',
    summary: '春季养生要点，助您健康度过春天',
    content: `1. 适度运动：选择适合的运动方式，如散步、太极拳等。
2. 防寒保暖：注意天气变化，及时增减衣物。
3. 调节作息：保持规律作息，避免熬夜。
4. 饮食调理：多吃时令蔬果，增强免疫力。
5. 心理调适：保持心情愉悦，多参加社交活动。
6. 预防感冒：勤洗手，保持室内通风。`,
    image: 'https://images.pexels.com/photos/3768145/pexels-photo-3768145.jpeg',
    date: '2024-03-14'
  },
  {
    title: '老年人运动指南',
    summary: '科学运动，让您保持健康活力',
    content: `1. 选择合适运动：建议选择低强度有氧运动，如散步、太极拳、游泳等。
2. 控制运动时间：每次运动30-60分钟为宜。
3. 循序渐进：从低强度开始，逐渐增加运动量。
4. 注意安全：选择平坦的场地，避免易跌倒的地方。
5. 坚持规律：每周保持3-5次运动频率。
6. 及时补充水分：运动时要适时补充水分。
7. 注意身体反应：如有不适要立即停止运动。`,
    image: 'https://images.pexels.com/photos/3768144/pexels-photo-3768144.jpeg',
    date: '2024-03-13'
  }
])

const allNotices = ref([
  { title: '关于开展春季健康体检的通知', date: '2024-03-15', content: '为了保障社区老年人的身体健康，我们将于2024年3月20日至3月25日开展春季健康体检活动。请各位老年朋友提前预约登记。' },
  { title: '社区卫生服务站服务时间调整公告', date: '2024-03-14', content: '从2024年4月1日起，社区卫生服务站的服务时间调整为：工作日 8:00-18:00，周末 9:00-16:00。' },
  { title: '疫情防控注意事项提醒', date: '2024-03-13', content: '请社区居民继续做好个人防护，保持社交距离，勤洗手，戴口罩。' },
  { title: '社区文化活动中心设施维护通知', date: '2024-03-12', content: '社区文化活动中心将于本周六进行设施维护，当天暂停使用。' },
  { title: '居家养老服务补贴申请通知', date: '2024-03-11', content: '符合条件的老年人可以申请居家养老服务补贴，请携带相关证件到社区服务中心办理。' },
  { title: '老年人心理健康讲座预告', date: '2024-03-10', content: '本周日下午2点将在社区活动中心举办老年人心理健康讲座，欢迎参加。' }
])

const notices = computed(() => {
  return allNotices.value.slice(0, 4)
})

const recentActivities = ref([
  { title: '太极拳教学', time: '2024-03-20 09:00', status: '报名中' },
  { title: '棋牌比赛', time: '2024-03-21 14:00', status: '报名中' },
  { title: '手工艺制作', time: '2024-03-22 15:00', status: '未开始' },
  { title: '春游活动', time: '2024-03-25 09:00', status: '筹备中' }
])

onMounted(async () => {
  try {
    const { data } = await listProject()
    services.value = data.map(item => ({
      title: item.projectName,
      description: item.description,
      icon: item.icon || new URL('@/assets/images/service-default.png', import.meta.url).href
    }))
  } catch (error) {
    console.error('获取服务项目失败:', error)
  }
})

const handleEmergency = () => {
  ElMessageBox.confirm('确认发起紧急求助？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emergencyDialogVisible.value = true
    // 这里可以调用后端接口发送紧急求助信号
  })
}

const cancelEmergency = () => {
  ElMessageBox.confirm('确认取消紧急求助？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '返回',
    type: 'warning'
  }).then(() => {
    emergencyDialogVisible.value = false
    ElMessage.info('已取消紧急求助')
  })
}

const callEmergency = () => {
  window.location.href = 'tel:120'
}

const goToService = () => {
  router.push('/front/service')
}

const goToActivities = () => {
  router.push('/front/activities')
}

const viewNoticeDetail = (notice) => {
  currentNotice.value = notice
  noticeDialogVisible.value = true
}

const viewMoreNotices = () => {
  noticeListDialogVisible.value = true
}

const viewNewsDetail = (news) => {
  currentNews.value = news
  newsDialogVisible.value = true
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.nav-menu {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.flex-grow {
  flex-grow: 1;
}

.banner {
  margin-bottom: 40px;
}

.banner-content {
  position: relative;
  height: 100%;
}

.banner-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.banner-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.banner-text h2 {
  margin: 0;
  font-size: 24px;
}

.banner-text p {
  margin: 10px 0 0;
  font-size: 16px;
}

.section-title {
  text-align: center;
  margin: 40px 0;
  font-size: 28px;
  color: #333;
}

.service-section {
  margin-bottom: 40px;
}

.service-card {
  text-align: center;
  padding: 20px;
  transition: all 0.3s;
}

.service-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
}

.news-section {
  margin-bottom: 40px;
}

.news-card {
  height: 100%;
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 15px;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.community-section {
  margin-bottom: 40px;
}

.notice-list, .activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li, .activity-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.activity-info {
  flex: 1;
  margin-right: 15px;
}

.activity-time {
  color: #999;
  font-size: 14px;
  margin-left: 15px;
}

.sos-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.sos-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.emergency-content {
  text-align: center;
}

.emergency-message {
  font-size: 18px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.emergency-info {
  text-align: left;
  margin: 20px 0;
}

.emergency-info p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.emergency-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice-detail {
  padding: 20px;
}

.notice-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.notice-info {
  color: #999;
  font-size: 14px;
}

.notice-list li {
  cursor: pointer;
  transition: all 0.3s;
}

.notice-list li:hover {
  background-color: #f5f7fa;
}

.news-detail {
  padding: 20px;
}

.news-detail-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.news-detail-summary {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.news-detail-text {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;
  margin-bottom: 20px;
}

.news-detail-info {
  color: #999;
  font-size: 14px;
}
</style> 