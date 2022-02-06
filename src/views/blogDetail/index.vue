<template>
  <div v-if="!isLoading" class="detail-container">
    <div class="left-container">
      <h1 class="detail-title">{{ articleData.title }}</h1>

      <div class="user-info">
        <div class="left-info">
          <div class="avatar">
            <el-avatar :size="50" :src="avatar" />
          </div>
          <div class="info-detail">
            <p class="author">{{ articleData.User.author }}</p>
            <p class="date">{{ articleData.createdAt | formatTime }}</p>
          </div>
        </div>
        <div class="right-info">
          <span class="tag">所属标签:</span>
          <el-tag type="success">{{ articleData.Label.tag }}</el-tag>
        </div>
      </div>
      <div class="detail-content">
        <div class="cover">
          <el-image
            style="width: 100%; margin-bottom: 20px"
            :src="articleData.cover"
          />
        </div>
        <div class="content-html" v-html="articleData.content" />
      </div>
    </div>
    <div class="right-container">
      <div class="right-user">
        <div class="right-user-info">
          <div class="avatar">
            <el-avatar :size="60" :src="avatar" />
          </div>
          <div class="avatar-right">
            <p>{{ articleData.User.author }}</p>
            <p>{{ articleData.User.UserInfo.autograph }}</p>
          </div>
        </div>
        <div class="right-other-info">
          <div class="like">
            <i class="el-icon-magic-stick" />
            文章被点赞<span>{{ articleData.likecount }}</span>次
          </div>
          <div class="view">
            <i class="el-icon-view" /> 文章被浏览<span>0</span>次
          </div>
          <div class="rank">
            <i class="el-icon-trophy" /> 该作者共发布<span>{{
              articleData.User.count
            }}</span>篇文章
          </div>
        </div>
      </div>
      <div class="right-content">其他内容</div>
    </div>
  </div>
  <div v-else>
    <div class="model">
      <div class="model-text">
        <p>正在拼命加载……</p>
        <i class="el-icon-loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleDetail } from '@/api/article'
import moment from 'moment'
export default {
  filters: {
    formatTime(time) {
      return moment(time).format('yyyy年MM月DD日 h:mm')
    }
  },
  data() {
    return {
      id: '',
      srcList: [],
      articleData: {},
      isLoading: true
    }
  },
  computed: {
    tag() {
      return this.articleData.Label.tag
    },
    avatar() {
      return this.articleData.User.UserInfo.avatar
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getArticleDetail(this.id).then((res) => {
        this.articleData = res.data
        this.isLoading = false
        this.srcList.push(this.articleData.cover)
        // console.log(this.articleData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: calc(100vh - 50px);
  background-color: rgb(244, 245, 245);
  padding: 20px;
  display: flex;
  justify-content: space-around;
  .left-container {
    border-radius: 4px;
    width: 70%;
    padding: 30px;
    background-color: rgb(255, 255, 255);
    .detail-title {
      padding: 0;
      margin: 0;
      font-size: 24px;
    }
    .user-info {
      margin: 10px 0 20px;
      // background-color: tan;

      display: flex;
      align-items: center;
      justify-content: space-between;
      .left-info {
        display: flex;
        justify-content: space-between;
        .avatar {
          margin-right: 10px;
        }
        p {
          margin: 0;
          padding: 0;
          color: #515767;
          font-size: 14px;
        }
        .info-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          p.author {
            font-size: 15px;
          }
        }
      }
      .right-info {
        .tag {
          margin-right: 10px;
        }
      }
    }
  }
  .right-container {
    border-radius: 2px;
    width: 25%;
    // background-color: tomato;
    .right-user {
      width: 100%;
      height: 250px;
      background-color: #fff;
      // border: 1px solid #111;
      margin-bottom: 20px;
      padding: 20px;
      .right-user-info {
        display: flex;
        height: 90px;
        // background-color: teal;
        align-items: center;
        border-bottom: 1px solid #999;
        .avatar {
          margin-right: 15px;
        }
        p {
          padding: 0;
          margin: 0;
          line-height: 25px;
        }
      }
      .right-other-info {
        padding: 10px 0;
        div {
          margin: 10px 0;
          i {
            background-color: rgb(225, 239, 255);
            display: inline-block;
            width: 25px;
            height: 25px;
            line-height: 25px;
            border-radius: 50%;
            text-align: center;
            color: rgb(123, 185, 255);
            font-weight: 700;
            margin-right: 5px;
          }
          span {
            font-size: 22px;
            margin: 0 2px;
            color: aqua;
          }
        }
      }
    }
  }
}
.model {
  width: 100%;
  height: calc(100vh - 50px);
  background-color: rgba(0, 0, 0, 0.8);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .model-text {
    position: absolute;
    z-index: 1;
    color: #fff;
    font-size: 25px;
    i {
      font-size: 50px;
    }
  }
}
</style>
