<template>
  <div class="app-container home">
    <fieldset>
      <!-- 添加一个用于显示扇形图的div -->
      <div id="chart" style="width: 105%; height: 84vh;"></div>
    </fieldset>
  </div>
</template>

<script setup name="Index">
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getEchartsData } from '@/api/echarts';

// 定义一个响应式变量 version，初始值为 '3.8.7'
const version = ref('3.8.7');

/**
 * 打开一个新的浏览器窗口并导航到指定的 URL。
 * @param {string} url - 要导航到的 URL。
 */
function goTarget(url) {
  // 使用 window.open 打开一个新的浏览器窗口，目标 URL 为传入的 url 参数，打开方式为在新的标签页中打开
  window.open(url, '__blank');
}

// 在组件挂载后初始化图表
onMounted(() => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);
  let currentIndex = 0; // 声明并初始化 currentIndex
  let intervalId = null; // 用于存储轮播定时器的 ID

  // 获取所有数据
  const fetchAllData = async () => {
    let allData = [];
    let page = 1;
    const pageSize = 100; // 每页的数据量
    let total = 0;

    do {
      const response = await getEchartsData({ page, pageSize }); // 假设接口支持分页参数
      allData = allData.concat(response.rows); // 合并数据
      total = response.total; // 获取总数据量
      page++;
    } while (allData.length < total); // 循环直到获取所有数据

    return allData;
  };

  // 将数组分成指定大小的块
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // 获取数据并初始化图表
  fetchAllData()
    .then(data => {
      console.log('All data:', data); // 打印所有数据

      // 将数据分成10个一组
      const groupedData = chunkArray(data, 10);

      // 将分组后的数据组合成多维数组
      const multiDimensionalArray = groupedData.map(group => {
        return {
          dateList: group.map(item => item.bodyTemperature),
          valueList: group.map(item => item.bloodPressure),
          valueList1: group.map(item => item.bloodLipid),
          valueList2: group.map(item => item.bloodSugar),
          valueList3: group.map(item => item.elderName),
        };
      });

      console.log('Grouped data:', multiDimensionalArray);

      // 声明并初始化分组后的数据
      const groupedValueList3 = multiDimensionalArray.map(group => group.valueList3);
      const groupedValueList2 = multiDimensionalArray.map(group => group.valueList2);
      const groupedValueList1 = multiDimensionalArray.map(group => group.valueList1);
      const groupedValueList = multiDimensionalArray.map(group => group.valueList);
      const groupedDataList = multiDimensionalArray.map(group => group.dateList);

      // 定义轮播函数
      const carousel = () => {
        console.log('Carousel function is called, currentIndex:', currentIndex);

        // 配置图表选项
        const option = {
          title: {
            text: '老人身体指标曲线',
          },
          legend: {
            data: ['体温', '血压', '血脂', '血糖'],
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              },
            },
          },
          xAxis: [
            {
              data: groupedValueList3[currentIndex],
              type: 'category',
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          series: [
            {
              name: '血压',
              stack: '总量',
              areaStyle: {},
              type: 'line',
              showSymbol: false,
              data: groupedValueList[currentIndex],
            },
            {
              name: '血脂',
              stack: '总量',
              areaStyle: {},
              type: 'line',
              showSymbol: false,
              data: groupedValueList1[currentIndex],
            },
            {
              name: '体温',
              stack: '总量',
              areaStyle: {},
              type: 'line',
              showSymbol: false,
              data: groupedDataList[currentIndex],
            },
            {
              name: '血糖',
              areaStyle: {},
              stack: '总量',
              type: 'line',
              showSymbol: false,
              data: groupedValueList2[currentIndex],
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
            },
          ],
        };

        console.log('Before setting option:', option);
        if (option) {
          myChart.clear(); // 清除之前的图表数据
          myChart.setOption(option, true); // 设置新的图表选项
        }
        console.log('After setting option');

        // 更新当前索引
        currentIndex = (currentIndex + 1) % groupedDataList.length;
        console.log('Updated index:', currentIndex);
      };

      // 首次调用轮播函数
      carousel();

      // 每隔3秒调用一次轮播函数
      intervalId = setInterval(() => {
        carousel();
      }, 3000);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  // 组件卸载时清除定时器
  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
});
</script>

<style scoped>
/* 添加样式（如果需要） */
</style>