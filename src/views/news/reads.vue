<template>
  <div class="news-reads">
    <legend>老人体温统计</legend><br>
  <!-- 添加一个用于显示扇形图的div -->
    <div id="chart" style="width: 600px;height:400px;"></div>  
  </div>
</template>

<script setup name="Index">
import * as echarts from 'echarts';

// 定义一个响应式变量 version，初始值为 '3.8.7'
const version = ref('3.8.7')

// 定义两个响应式变量来存储收缩压和舒张压的值
const systolicPressure = ref('')
const diastolicPressure = ref('')

/**
 * 打开一个新的浏览器窗口并导航到指定的 URL。
 * @param {string} url - 要导航到的 URL。
 */
function goTarget(url) {
  // 使用 window.open 打开一个新的浏览器窗口，目标 URL 为传入的 url 参数，打开方式为在新的标签页中打开
  window.open(url, '__blank')
}

// 在组件挂载后初始化图表
onMounted(() => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);

let data = [["2020-06-05",116],["2020-06-06",129],["2020-06-07",135],["2020-06-08",86],["2020-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];

var dateList = data.map(function (item) {
    return item[0];
});
var valueList = data.map(function (item) {
    return item[1];
});

let option = {

    // Make gradient line here
    visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
    }, {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: dateList.length - 1
    }],


    title: [{
        left: 'center',
        text: '小红七日体温'
    }, {
        top: '55%',
        left: 'center',
        text: '小蓝七日体温'
    }],
    tooltip: {
        trigger: 'axis'
    },
    xAxis: [{
        data: dateList
    }, {
        data: dateList,
        gridIndex: 1
    }],
    yAxis: [{
        splitLine: {show: false}
    }, {
        splitLine: {show: false},
        gridIndex: 1
    }],
    grid: [{
        bottom: '60%'
    }, {
        top: '60%'
    }],
    series: [{
        type: 'line',
        showSymbol: false,
        data: valueList
    }, {
        type: 'line',
        showSymbol: false,
        data: valueList,
        xAxisIndex: 1,
        yAxisIndex: 1
    }]
};
  
  option && myChart.setOption(option);
});
</script>
