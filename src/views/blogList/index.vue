<template>
  <div class="blog-list-container">
    <div class="head">
      <el-input
        v-model="reqBody.title"
        class="searchInput"
        placeholder="请输入文章标题"
        suffix-icon="el-icon-search"
        @change="handleSearch($event)"
        @keydown.enter.native="handleSearch($event)"
      />
    </div>
    <el-table v-loading="isLoading" class="table" :data="tableData">
      <el-table-column type="index" width="30" />
      <el-table-column prop="title" label="标题" width="200">
        <template slot-scope="scope">
          <span>《{{ scope.row.title }}》</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="80" />
      <el-table-column prop="tag" label="标签" width="80" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="abstract" label="文章摘要" width="260" />

      <el-table-column prop="cover" label="文章封面" width="200">
        <template slot-scope="scope">
          <!-- <img v-if="scope.row.cover" class="cover-img" :src="scope.row.cover" alt=""> -->
          <el-image
            v-if="scope.row.cover"
            style="width: 120px"
            :src="scope.row.cover"
            :preview-src-list="srcList"
          />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="handle" width="220" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            style="font-size: 12px"
            @click="handleLook(scope.$index, scope.row)"
          >查看</el-button>
          <el-button
            size="small"
            type="success"
            style="font-size: 12px"
            @click="handleAdopt(scope.$index, scope.row)"
          >通过</el-button>
          <el-button
            size="small"
            type="danger"
            style="font-size: 12px"
            @click="handleCancel(scope.$index, scope.row)"
          >驳回</el-button>
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
    <el-dialog title="驳回理由" :visible.sync="dialogFormVisible">
      <span class="reason">驳回成功！请输入您驳回的理由</span>
      <el-input
        v-model="message"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSendReason"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArticle, reviewArticle } from '@/api/article'
import moment from 'moment'
import { sendMessage } from '@/api/message'
export default {
  filters: {
    formatTime(time) {
      return moment(time).format('yyyy-MM-DD h:mm:ss ')
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      isLoading: false,
      search: {
        title: '',
        option: ''
      },
      nowBlog: {},
      srcList: [],
      tableData: [],
      reqBody: {
        title: '',
        review: 'waiting'
      },
      message: '',
      pager: {
        page: 1,
        total: 0,
        size: 10
      }
    }
  },
  mounted() {
    this.getArticleList()
  },
  methods: {
    getArticleList() {
      const body = {
        ...this.reqBody,
        ...this.pager
      }
      this.isLoading = true
      getArticle(body).then((res) => {
        // console.log(res)
        if (res.code === '200') {
          this.tableData = this.handleRequest(res.data.data)
          this.pager.total = res.data.total
          this.isLoading = false
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pager.size = val
      this.pager.page = 1
      this.getArticleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pager.page = val
      this.getArticleList()
    },
    /**
     * 处理响应
     */
    handleRequest(arr) {
      const result = arr.map((item) => {
        const author = item.User.author
        const tag = item.Label.tag
        item.cover && this.srcList.push(item.cover)
        return {
          ...item,
          author,
          tag
        }
      })
      return result
    },
    handleLook(index, row) {
      // console.log(index, row)
      // console.log('点击了查看')
      this.$router.push({
        name: 'Detail',
        query: {
          id: row.id
        }
      })
    },
    handleAdopt(index, row) {
      console.log(index, row)
      this.nowBlog = row

      // console.log('点击了通过')
      reviewArticle({
        id: row.id,
        review: 'success'
      }).then(res => {
        if (res.code === '200') {
          this.$message({
            type: 'success',
            message: '评审成功'
          })
          this.getArticleList()
          sendMessage({
            content: `您的文章《${this.nowBlog.title}》已通过评审`,
            users: [this.nowBlog.UserId]
          }).then(res => {

          })
        }
      })
    },
    handleCancel(index, row) {
      console.log(index, row)
      this.nowBlog = row
      // console.log('点击了驳回')
      this.$confirm('此操作会驳回文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          reviewArticle({
            id: row.id,
            review: 'refuse'
          }).then(res => {
            console.log(res)
            this.dialogFormVisible = true
            this.getArticleList()
          })
        })
    },
    handleSendReason() {
      // 发送消息请求
      // 关闭弹框
      // console.log(this.message)
      sendMessage({
        content: `您的文章《${this.nowBlog.title}》未通过评审，原因是：` + this.message,
        users: [this.nowBlog.UserId]
      }).then(res => {
        console.log(res)
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '已完成评审'
        })
      })
    },
    handleSearch(val) {
      this.getArticleList()
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-list-container {
  padding: 20px;
  .pager {
    margin-top: 20px;
    text-align: center;
  }
  .searchInput {
    width: 300px;
  }
  .head {
    margin-bottom: 20px;
  }
  .cover-img {
    width: 120px;
  }
  .reason{
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 10px;
    color: #333;
  }
}
</style>
