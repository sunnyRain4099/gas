<template>
  <div id="app">
    <div id="container"></div>
    <div id="reportForm" v-show="showReportForm">
      <h3>编辑报警单</h3>
      <label>事件类型：</label>
      <div>
        <input
          type="radio"
          name="eventType"
          value="爆炸"
          v-model="reportData.eventType"
        />
        爆炸
        <input
          type="radio"
          name="eventType"
          value="火灾"
          v-model="reportData.eventType"
        />
        火灾
        <input
          type="radio"
          name="eventType"
          value="泄露"
          v-model="reportData.eventType"
        />
        泄露
      </div>
      <label>发生时间：</label>
      <input
        type="datetime-local"
        id="eventTime"
        v-model="reportData.eventTime"
      />
      <label>管道位置：</label>
      <input
        type="text"
        id="pipelineLocation"
        v-model="reportData.pipelineLocation"
      />
      <label>管道材料：</label>
      <input
        type="text"
        id="pipelineMaterial"
        v-model="reportData.pipelineMaterial"
      />
      <label>管道埋深：</label>
      <input
        type="text"
        id="pipelineDepth"
        v-model="reportData.pipelineDepth"
      />
      <label>管道外径：</label>
      <input
        type="text"
        id="pipelineDiameter"
        v-model="reportData.pipelineDiameter"
      />
      <label>管道压力：</label>
      <input
        type="text"
        id="pipelinePressure"
        v-model="reportData.pipelinePressure"
      />
      <label>人口密度：</label>
      <input
        type="text"
        id="populationDensity"
        v-model="reportData.populationDensity"
      />
      <label>附近区域：</label>
      <input type="text" id="nearbyArea" v-model="reportData.nearbyArea" />
      <label>气流方向：</label>
      <input
        type="text"
        id="airflowDirection"
        v-model="reportData.airflowDirection"
      />
      <div style="text-align: center">
        <button id="submitReportBtn" @click="submitReport">生成报警单</button>
        <button id="cancelReportBtn" @click="cancelReport">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const showReportForm = ref(false)
const reportData = ref({
  eventType: '爆炸',
  eventTime: '',
  pipelineLocation: '',
  pipelineMaterial: '',
  pipelineDepth: '',
  pipelineDiameter: '',
  pipelinePressure: '',
  populationDensity: '',
  nearbyArea: '',
  airflowDirection: ''
})

const initMap = async () => {
  const AMap = await AMapLoader.load({
    key: 'df24ee5716a2d2333889bb0ece935787',
    version: '2.0'
  })

  const map = new AMap.Map('container', {
    viewMode: '2D',
    zoom: 17,
    center: [116.397428, 39.90923]
  })

  const pipelineData = [
    {
      path: [
        [116.397428, 39.90923],
        [116.398428, 39.90923],
        [116.399428, 39.91023]
      ],
      pipelineLocation: '北京市东城区',
      pipelineMaterial: '钢材',
      pipelineDepth: '2m',
      pipelineDiameter: '500mm',
      pipelinePressure: '0.8MPa',
      populationDensity: '每平方公里2000人',
      nearbyArea: '居民区',
      airflowDirection: '北向南'
    },
    {
      path: [
        [116.400428, 39.91123],
        [116.401428, 39.91223]
      ],
      pipelineLocation: '北京市西城区',
      pipelineMaterial: '铸铁',
      pipelineDepth: '1.5m',
      pipelineDiameter: '300mm',
      pipelinePressure: '0.5MPa',
      populationDensity: '每平方公里1500人',
      nearbyArea: '商业区',
      airflowDirection: '南向北'
    }
  ]

  pipelineData.forEach((pipe) => {
    const polyline = new AMap.Polyline({
      path: pipe.path,
      borderWeight: 2,
      strokeColor: '#FF33FF',
      lineJoin: 'round',
      map: map
    })

    polyline.on('click', (e) => {
      const content = `
        <div>
          <h4>位置详情</h4>
          <p>坐标: ${JSON.stringify(e.lnglat)}</p>
          <button id="alarmBtn">报警</button>
          <button id="detailsBtn">详情</button>
        </div>
      `

      const infoWindow = new AMap.InfoWindow({
        content: content,
        offset: new AMap.Pixel(0, -30)
      })
      infoWindow.open(map, e.lnglat)

      setTimeout(() => {
        document.getElementById('alarmBtn').onclick = () => {
          openReportForm(pipe)
        }
        document.getElementById('detailsBtn').onclick = () => {
          showDetails(pipe)
        }
      }, 500)
    })
  })
}

const openReportForm = (pipe) => {
  showReportForm.value = true
  Object.assign(reportData.value, pipe)
}

const showDetails = (pipe) => {
  const content = `
    <div>
      <h4>管道详细信息</h4>
      <p>位置: ${pipe.pipelineLocation}</p>
      <p>材料: ${pipe.pipelineMaterial}</p>
      <p>埋深: ${pipe.pipelineDepth}</p>
      <p>外径: ${pipe.pipelineDiameter}</p>
      <p>压力: ${pipe.pipelinePressure}</p>
      <p>人口密度: ${pipe.populationDensity}</p>
      <p>附近区域: ${pipe.nearbyArea}</p>
      <p>气流方向: ${pipe.airflowDirection}</p>
    </div>
  `

  const infoWindow = new AMap.InfoWindow({
    content: content,
    offset: new AMap.Pixel(0, -30)
  })
  infoWindow.open(map, map.getCenter())
}

const submitReport = () => {
  const reportDataToSend = {
    eventType: reportData.value.eventType,
    eventTime: reportData.value.eventTime,
    pipelineLocation: reportData.value.pipelineLocation,
    pipelineMaterial: reportData.value.pipelineMaterial,
    pipelineDepth: reportData.value.pipelineDepth,
    pipelineDiameter: reportData.value.pipelineDiameter,
    pipelinePressure: reportData.value.pipelinePressure,
    populationDensity: reportData.value.populationDensity,
    nearbyArea: reportData.value.nearbyArea,
    airflowDirection: reportData.value.airflowDirection
  }

  fetch('http://localhost:8080/admin/warning/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportDataToSend)
  })
    .then((response) => response.json())
    .then((data) => {
      alert('报警单已生成！')
      showReportForm.value = false
    })
    .catch((error) => {
      console.error('生成报警单失败:', error)
    })
}

const cancelReport = () => {
  showReportForm.value = false
}

onMounted(() => {
  initMap()
})
</script>

<style>
html,
body,
#container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#reportForm {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  max-width: 300px;
  width: 100%;
  z-index: 1000;
}
#reportForm input,
#reportForm select,
#reportForm button {
  margin: 10px 0;
  width: calc(100% - 20px);
  padding: 5px;
}
#reportForm button {
  width: calc(50% - 15px);
  margin-right: 10px;
}
</style>
