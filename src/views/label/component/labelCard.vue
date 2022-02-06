<template>
  <div class="label-card-container">
    <h2 class="tag">
      <el-tag>{{ info.tag }}</el-tag>
    </h2>
    <div class="handle">
      <p>
        下属文章数量: <span>{{ count }}</span>
      </p>
      <el-tooltip effect="dark" content="修改标签" placement="top">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          circle
          title="修改"
          @click="handleClick"
        />
      </el-tooltip>
    </div>
    <el-dialog width="40%" title="更改此标签" :visible.sync="dialogFormVisible">
      <span>标签名：</span><el-input
        v-model="tagName"
        class="inputWidth"
        placeholder="请输入标签"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { countArticle } from '@/api/article'
import { updateLabel } from '@/api/label'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      tagName: this.info.tag,
      count: 0
    }
  },
  created() {
    this.handleCount()
  },
  methods: {
    handleCount() {
      countArticle({ labelId: this.info.id }).then((res) => {
        if (res.code === '200') {
          this.count = res.data
        }
      })
    },
    handleClick() {
      // console.log(this.info)
      if (this.count > 0) {
        this.$confirm('此操作会更改标签下属所有文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 弹出更改框
          this.dialogFormVisible = true
        })
      } else {
        this.dialogFormVisible = true
      }
    },
    handleEdit() {
      updateLabel({
        id: this.info.id,
        tag: this.tagName
      }).then(res => {
        if (res.code === '200') {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '更改成功'
          })
          this.$emit('handleUpdate')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.label-card-container {
  border-radius: 8px;
  background-color: #fff;
  width: 290px;
  height: 100px;
  margin: 10px 35px 10px 10px;
  padding: 10px;
  box-sizing: border-box;

  .tag {
    text-align: center;
    margin: 0;
    padding: 0;
    color: #333;
    margin-bottom: 15px;
    .el-tag {
      font-size: 18px;
      padding: 0 12px;
    }
  }
  p {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 24px;
      color: lightseagreen;
    }
  }
  .inputWidth {
    width: 80%;
  }
}
</style>
