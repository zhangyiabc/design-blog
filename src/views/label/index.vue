<template>
  <div v-if="labelList.length > 0" class="label-container">
    <div class="head">
      <el-button icon="el-icon-plus" type="primary" @click="dialogFormVisible = true">新增标签</el-button>
    </div>
    <div class="label-all">
      <template v-for="item of labelList">
        <Card :key="item.id" :info="item" @handleUpdate="handleUpdate" />
      </template>
    </div>
    <el-dialog width="40%" title="新增标签" :visible.sync="dialogFormVisible">
      <span>标签名：</span><el-input v-model="newTag" class="inputWidth" placeholder="请输入新标签" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllLabel, addLabel } from '@/api/label'
import Card from './component/labelCard.vue'
export default {
  components: {
    Card
  },
  data() {
    return {
      newTag: '',
      dialogFormVisible: false,
      labelList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getAllLabel().then((res) => {
        console.log(res)
        this.labelList = res.data
      })
    },
    handleAdd() {
      // 新增一个标签
      // this.dialogFormVisible = true
      // console.log(this.newTag)
      addLabel({ tag: this.newTag }).then(res => {
        console.log(res)
        if (res.code === '200') {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogFormVisible = false
          // 更改成功调用获取接口
          this.getList()
        }
      })
    },
    handleUpdate() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.label-container {
  padding: 20px;
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
  background-color: rgb(244, 245, 245);
  .label-all {
    display: flex;
    justify-content: flex-start;
    // justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
  }
  .head{
    margin: 10px;
  }
  .inputWidth{
    width: 80%;
  }
}
</style>
