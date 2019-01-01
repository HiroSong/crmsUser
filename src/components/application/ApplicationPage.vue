<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">共享设置</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse v-if="teamShare.length!==0" accordion>
        <el-collapse-item v-for="(item,index) in teamShare" :key="index">
          <template slot="title">
            <div
              v-if="item.isMainCourse"
              class="content-text bold-text"
            >{{item.receiveCourse.receiveCourseName+'('+item.receiveCourse.teacherName+')'}}</div>
            <div
              v-else
              class="content-text bold-text"
            >{{item.masterCourse.masterCourseName+'('+item.masterCourse.teacherName+')'}}</div>
          </template>
          <el-row>
            <el-col :span="8" class="content-text">共享类型：</el-col>
            <el-col :span="16" class="content-text text-center">共享分组</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="content-text">共享情况：</el-col>
            <el-col v-if="item.isMainCourse" :span="16" class="content-text text-center">主课程</el-col>
            <el-col v-else :span="16" class="content-text text-center">从课程</el-col>
          </el-row>
          <el-row type="flex" justify="end" class="small-gap">
            <el-button
              plain
              class="orange-text"
              size="small"
              @click.native.prevent="cancleSharing('/course/teamshare/'+item.id)"
            >取消共享</el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-collapse v-if="seminarShare.length!==0" accordion>
        <el-collapse-item v-for="(item,index) in seminarShare" :key="index">
          <template slot="title">
            <div
              v-if="item.isMainCourse"
              class="content-text bold-text"
            >{{item.receiveCourse.receiveCourseName+'('+item.receiveCourse.teacherName+')'}}</div>
            <div
              v-else
              class="content-text bold-text"
            >{{item.masterCourse.masterCourseName+'('+item.masterCourse.teacherName+')'}}</div>
          </template>
          <el-row>
            <el-col :span="8" class="content-text">共享类型：</el-col>
            <el-col :span="16" class="content-text text-center">共享讨论课</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="content-text">共享情况：</el-col>
            <el-col v-if="item.isMainCourse" :span="16" class="content-text text-center">主课程</el-col>
            <el-col v-else :span="16" class="content-text text-center">从课程</el-col>
          </el-row>
          <el-row type="flex" justify="end" class="small-gap">
            <el-button
              plain
              class="orange-text"
              size="small"
              @click.native.prevent="cancleSharing('/course/seminarshare/'+item.id)"
            >取消共享</el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createSharing"
          >新增共享</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'ApplicationPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      teamShare: [],
      seminarShare: []
    }
  },
  computed: {
    courseID() {
      return this.$route.query.courseID
    }
  },
  methods: {
    cancleSharing(url) {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定取消与该课程的共享吗？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        cancelBtn: {
          text: '放弃',
          active: false,
          disabled: false
        },
        onConfirm: () => {
          this.$http.delete(url).then(() => {
            this.$createToast({
              time: 500,
              txt: '取消成功',
              type: "correct",
              onTimeout: () => {
                this.$http.get('/course/' + this.courseID + '/teamshare').then(
                  response => {
                    this.teamShare = []
                    response.forEach(res => {
                      this.teamShare.push(res)
                    })
                  }).catch(error => {
                    this.$createToast({
                      time: 500,
                      txt: error.message,
                      type: "error"
                    }).show()
                  })
                this.$http.get('/course/' + this.courseID + '/seminarshare').then(
                  response => {
                    this.seminarShare = []
                    response.forEach(res => {
                      this.seminarShare.push(res)
                    })
                  }).catch(error => {
                    this.$createToast({
                      time: 500,
                      txt: error.message,
                      type: "error"
                    }).show()
                  })
              }
            }).show()
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
      }).show()
    },
    createSharing() {
      this.$router.push({ path: '/application/create', query: { courseID: this.courseID } })
    }
  },
  created() {
    this.$http.get('/course/' + this.courseID + '/teamshare').then(
      response => {
        response.forEach(res => {
          this.teamShare.push(res)
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    this.$http.get('/course/' + this.courseID + '/seminarshare').then(
      response => {
        response.forEach(res => {
          this.seminarShare.push(res)
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
  }
}
</script>
