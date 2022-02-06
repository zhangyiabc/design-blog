<template>
  <div class="count-label">
    <div ref="labelEcharts" class="label-echarts" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { countLabel } from '@/api/label'
export default {
  data() {
    return {
      dataList: [],
      nameArr: [],
      dataArr: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      countLabel().then(res => {
        this.dataList = this.handleRank(res.data)
        this.handleArr(this.dataList)
        this.initEcharts()
      })
    },
    initEcharts() {
      var myChart = echarts.init(this.$refs.labelEcharts)
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: this.nameArr,
          axisLabel: {
            interval: 0,
            rotate: -20
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0]

            return data.name + '<br>' + '包含文章：' + data.value + '篇'
          }
        },
        series: [
          {
            data: this.dataArr,
            type: 'bar',
            barWidth: '40%',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    },
    handleRank(arr) {
      arr.sort((a, b) => b.count - a.count)
      console.log(arr)
      return arr
    },
    handleArr(arr) {
      for (const item of arr) {
        this.nameArr.push(item.tag)
        this.dataArr.push(item.count)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .label-echarts{
    margin-top: 40px;
    height: 450px;
    width: 100%;
  }
</style>
