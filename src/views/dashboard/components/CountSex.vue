<template>
  <div class="count-sex">
    <div ref="sexEcharts" class="sex-echarts" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { countSex } from '@/api/user'
export default {
  data() {
    return {
      sexData: {}
    }
  },
  created() {
    this.handleCount()
  },
  methods: {
    initEcharts() {
      var myChart = echarts.init(this.$refs.sexEcharts)
      const that = this
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '性别统计饼图',
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              }
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [

              { value: +that.sexData.male, name: '男' },
              { value: +that.sexData.female, name: '女' }
            ]
          }
        ]
      })
    },
    handleCount() {
      countSex().then(res => {
        console.log(res.data)
        this.sexData = res.data
        this.initEcharts()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .sex-echarts{
    margin-top: 40px;
    height: 450px;
    width: 100%;
  }
</style>
