<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户性别统计" name="first">
        <CountSex v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="活跃前十排行" name="second">
        <CountActive v-if="activeName === 'second'" />
      </el-tab-pane>
      <el-tab-pane label="标签使用量统计" name="third">
        <CountLabel v-if="activeName === 'third'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import CountSex from './components/CountSex.vue'
import CountActive from './components/CountActive.vue'
import CountLabel from './components/CountLabel.vue'
export default {
  name: 'Dashboard',
  components: {
    CountSex,
    CountActive,
    CountLabel
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {

  },
  methods: {
    handleClick(tab, event) {

    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding: 20px;
    width: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
