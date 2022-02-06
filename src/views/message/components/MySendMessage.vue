<template>
  <div class="send-message">
    <div class="head">
      <el-button type="primary" @click="handleClick">发送系统消息</el-button>
      <el-select
        v-model="searchData.status"
        class="searchInput"
        placeholder="请选择消息阅读状态"
        clearable
        @change="handleChange"
      >
        <el-option
          v-for="item in option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table v-loading="isLoading" class="table" :data="tableData">
      <el-table-column type="index" width="40" />
      <el-table-column prop="UserId" label="用户ID" width="80">
        <template slot-scope="scope">
          <b>{{ scope.row.UserId }}</b>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="接收人" width="120">
        <template slot-scope="scope">
          <b>{{ scope.row.User.author }}</b>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="阅读状态"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status | formatStatus }}</span> -->
          <el-tag v-if="scope.row.status === 'read'" type="success">{{
            scope.row.status | formatStatus
          }}</el-tag>
          <el-tag v-else type="info">{{
            scope.row.status | formatStatus
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="消息内容" width="400">
        <template slot-scope="scope">
          <span v-html="scope.row.content" />
        </template>
      </el-table-column>

      <el-table-column prop="cover" label="用户头像" width="200" align="center">
        <template slot-scope="scope">
          <!-- <img v-if="scope.row.cover" class="cover-img" :src="scope.row.cover" alt=""> -->
          <el-avatar
            v-if="scope.row.User.UserInfo.avatar"
            shape="circle"
            :size="80"
            :src="scope.row.User.UserInfo.avatar"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="pager">
      <el-pagination
        :current-page="pager.page"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pager.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="为所有用户发送系统消息" :visible.sync="dialogFormVisible">
      <el-form ref="form" label-width="80px">
        <el-form-item label="消息内容">
          <el-input
            v-model.trim="message"
            class="message"
            type="textarea"
            :rows="2"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSendNotice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getMessage, sendMessage } from '@/api/message'
export default {
  filters: {
    formatTime(time) {
      return moment(time).format('yyyy-MM-DD h:mm:ss ')
    },
    formatStatus(status) {
      if (status === 'read') {
        return '已读'
      }
      return '未读'
    }
  },
  data() {
    return {
      searchData: {
        status: ''
      },
      option: [
        { label: '未读', value: 'unread' },
        {
          label: '已读',
          value: 'read'
        }
      ],
      dialogFormVisible: false,
      message: '',
      isLoading: false,
      srcList: [],
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const body = {
        ...this.searchData,
        ...this.pager
      }
      if (!this.searchData.status) {
        body.status = 'all'
      }
      getMessage(body).then((res) => {
        this.tableData = res.data.data
        this.pager.total = res.data.total
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pager.size = val
      this.pager.page = 1
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pager.page = val
      this.getData()
    },
    handleChange() {
      // console.log(123)
      this.getData()
    },
    // 发送系统消息
    handleSendNotice() {
      if (!this.message) {
        this.$message({
          type: 'warning',
          message: '消息内容不能为空'
        })
        return
      }
      sendMessage({
        content: this.message,
        users: []
      }).then(res => {
        if (res.code === '200') {
          this.$message({
            type: 'success',
            message: '发布成功'
          })
          this.dialogFormVisible = false
        }
      })
    },
    handleClick() {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.searchInput {
  margin-left: 20px;
  width: 230px;
}
.pager {
  text-align: center;
}
.message {
  width: 90%;
}
</style>
