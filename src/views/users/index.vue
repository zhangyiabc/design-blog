<template>
  <div class="users-container">
    <div class="head">
      <el-input
        v-model.trim="searchData.author"
        placeholder="输入用户昵称"
        class="searchInput"
        @change="handleSearch"
        @keydown.enter.native="handleSearch"
      />
      <el-select
        v-model="searchData.sex"
        class="searchInput"
        placeholder="请选择用户性别"
        clearable
        @change="handleChange"
      >
        <el-option
          v-for="item in optionsSex"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchData.online"
        class="searchInput"
        placeholder="请选择用户性别"
        clearable
        @change="handleChange"
      >
        <el-option
          v-for="item in optionsOnline"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table v-loading="isLoading" class="table" :data="userList">
      <el-table-column type="index" width="30" />
      <el-table-column prop="id" label="ID" width="40" />
      <el-table-column prop="author" label="作者" width="80" />
      <el-table-column prop="username" label="账号" width="120" />
      <el-table-column prop="sex" label="性别" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | formatSex }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="120" />
      <el-table-column prop="autograph" label="个性签名" width="120" />
      <el-table-column prop="email" label="用户邮箱" width="160" />
      <el-table-column prop="avatar" label="作者头像" width="105">
        <template slot-scope="scope">
          <el-avatar
            v-if="scope.row.avatar"
            shape="circle"
            :size="80"
            :src="scope.row.avatar"
          />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="在线状态" width="90">
        <template slot-scope="scope">
          <span>
            <el-tag v-if="scope.row.online === 'yes'" type="success">{{
              scope.row.online | formatOnline
            }}</el-tag>
            <el-tag v-else type="info">{{
              scope.row.online | formatOnline
            }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="handle" width="120" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            style="font-size: 12px"
            @click="handleSendMessage(scope.$index, scope.row)"
          >发送系统消息</el-button>
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
    <el-dialog title="发送系统消息" :visible.sync="dialogFormVisible">
      <el-input
        v-model.trim="message"
        type="textarea"
        :rows="2"
        placeholder="请输入消息内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSendNotice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { sendMessage } from '@/api/message'
import { getAllUsers } from '@/api/user'
export default {
  filters: {
    formatTime(time) {
      return moment(time).format('yyyy-MM-DD h:mm:ss ')
    },
    formatSex(sex) {
      if (+sex === 1) {
        return '男'
      }
      return '女'
    },
    formatOnline(online) {
      if (online === 'yes') {
        return '在线'
      } else {
        return '不在线'
      }
    }
  },
  data() {
    return {
      isLoading: false,
      dialogFormVisible: false,
      userList: [],
      srcList: [],
      message: '',
      searchData: {
        author: '',
        sex: 'all',
        online: 'all'
      },
      reqBody: {
        author: '',
        online: '',
        sex: ''
      },
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      optionsSex: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '0'
        },
        {
          label: '全部',
          value: 'all'
        }
      ],
      optionsOnline: [
        {
          label: '在线',
          value: 'yes'
        },
        {
          label: '离线',
          value: 'no'
        },
        {
          label: '全部',
          value: 'all'
        }
      ],
      nowUser: {}
    }
  },
  mounted() {
    this.getUserList()
    this.sockets.subscribe('adminUpdateUser', (data) => {
      const h = this.$createElement
      this.$notify({
        title: '注意注意',
        message: h(
          'i',
          { style: 'color: teal' },
          `id为：${data.userId}的用户，${data.type === 'in' ? '进入' : '退出'}了系统`
        )
      })
    })
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pager.size = val
      this.pager.page = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pager.page = val
      this.getUserList()
    },
    getUserList() {
      this.isLoading = true
      let body = {
        ...this.reqBody,
        ...this.pager,
        ...this.searchData
      }
      if (!this.searchData.sex) {
        body = {
          ...this.reqBody,
          ...this.pager,
          ...this.searchData,
          sex: 'all'
        }
      }

      if (!this.searchData.online) {
        body = {
          ...this.reqBody,
          ...this.pager,
          ...this.searchData,
          online: 'all'
        }
      }
      if (!this.searchData.online && !this.searchData.sex) {
        body = {
          ...this.reqBody,
          ...this.pager,
          ...this.searchData,
          sex: 'all',
          online: 'all'
        }
      }
      // console.log(body)

      getAllUsers(body)
        .then((res) => {
          // console.log(res)
          this.userList = this.handleRequest(res.data.data)
          this.pager.total = res.data.total
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleRequest(arr) {
      const result = arr.map((item) => {
        const {
          autograph = '',
          avatar = '',
          email = '',
          sex = '',
          tel = ''
        } = item.UserInfo
        return {
          ...item,
          autograph,
          avatar,
          email,
          sex,
          tel
        }
      })
      return result
    },
    handleSendMessage(index, row) {
      console.log('发送系统信息')
      console.log(index, row)
      // 1. 弹出框，需要给这个用户发送什么消息
      // 2. 发送ajax请求
      // 3. 关闭弹框
      this.nowUser = row
      this.dialogFormVisible = true
    },
    handleChange(val) {
      this.getUserList()
    },
    handleSearch(val) {
      // const res = val.trim()
      // if (!res) {
      //   return
      // }
      this.getUserList()
    },
    handleSendNotice() {
      sendMessage({
        content: this.message,
        users: [this.nowUser.id]
      }).then((res) => {
        if (res.code === '200') {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '发送成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.users-container {
  padding: 20px;
  .pager {
    margin-top: 20px;
    text-align: center;
  }
  .searchInput {
    width: 25%;
    margin-right: 20px;
  }
  .head {
    margin-bottom: 20px;
  }
}
</style>
