<template>
  <div class="message-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我发出的消息" name="first">
        <MySendMessage v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="我收到的反馈" name="second">
        <div v-if="activeName === 'second'">
          我收到的反馈
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MySendMessage from './components/MySendMessage.vue'
export default {
  components: {
    MySendMessage
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick() {
      console.log(123)
    }
  }
}
</script>

<style lang="scss" scoped>
  .message-container{
    padding: 20px;

  }
</style>
