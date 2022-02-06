<template>
  <div class="count-active">
    <div ref="activeEcharts" class="active-echarts" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { orderUser } from '@/api/user'
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
      orderUser({
        size: 10
      }).then((res) => {
        this.dataList = this.handleRankUser(res.data)
        this.handleArr(this.dataList)
        this.initEcharts()
      })
    },
    initEcharts() {
      const that = this
      var myChart = echarts.init(this.$refs.activeEcharts)
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: that.nameArr
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0]

            return '用户：' + data.name + '<br>' + '共发布文章：' + data.value + '篇'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: that.dataArr,
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
    handleRankUser(arr) {
      return arr.sort((a, b) => a.count - b.count)
    },
    handleArr(arr) {
      for (const item of arr) {
        this.nameArr.push(item.author)
        this.dataArr.push(item.count)
      }
      // console.log(this.nameArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.count-active {
  width: 100%;
}
.active-echarts {
  margin-top: 20px;
  height: 450px;
  width: 100%;
}
</style>
