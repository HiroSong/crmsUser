<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">待办</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div style="height: 30vh" v-if="teamShare.length!==0">
        <el-scrollbar class="full-height">
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in teamShare" :key="index">
              <template slot="title">
                <svg class="icon" style="width:0.875rem; height:0.875rem;" aria-hidden="true">
                  <use xlink:href="#icon-jingshi"></use>
                </svg>
                <div
                  class="content-text more-text"
                >{{item.masterCourseName+'('+item.masterCourseTeacherName+') -组队共享'}}</div>
              </template>
              <div
                class="tip-text"
              >{{item.masterCourseName+'('+item.masterCourseTeacherName+') 邀请您的课程'+item.receiveCourseName+'加入组队共享'}}</div>
              <el-row class="small-gap" type="flex" justify="space-around">
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('teamshare/'+item.id, {status:1})"
                >
                  <use xlink:href="#icon-dagou"></use>
                </svg>
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('teamshare/'+item.id, {status:0})"
                >
                  <use xlink:href="#icon-cha"></use>
                </svg>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div style="height: 30vh" v-if="seminarShare.length!==0">
        <el-scrollbar class="full-height">
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in seminarShare" :key="index">
              <template slot="title">
                <svg class="icon" style="width:0.875rem; height:0.875rem;" aria-hidden="true">
                  <use xlink:href="#icon-jingshi"></use>
                </svg>
                <div
                  class="content-text more-text"
                >{{item.masterCourseName+'('+item.masterCourseTeacherName+') -讨论课共享'}}</div>
              </template>
              <div
                class="tip-text"
              >{{item.masterCourseName+'('+item.masterCourseTeacherName+') 邀请您的课程'+item.receiveCourseName+'加入讨论课共享'}}</div>
              <el-row class="small-gap" type="flex" justify="space-around">
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('seminarshare/'+item.id, {status: 1})"
                >
                  <use xlink:href="#icon-dagou"></use>
                </svg>
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('seminarshare/'+item.id, {status: 0})"
                >
                  <use xlink:href="#icon-cha"></use>
                </svg>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div style="height: 30vh" v-if="validApply.length!==0">
        <el-scrollbar class="full-height">
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in validApply" :key="index">
              <template slot="title">
                <svg class="icon" style="width:0.875rem; height:0.875rem;" aria-hidden="true">
                  <use xlink:href="#icon-jingshi"></use>
                </svg>
                <div class="content-text more-text">{{item.courseName+'('+item.teamName+') -队伍审核'}}</div>
              </template>
              <el-row>
                <div
                  class="tip-text"
                >{{item.courseName+'-'+item.classGrade+'('+item.classSerial+')('+item.teamName+') '}}</div>
              </el-row>
              <el-row>
                <div class="tip-text">{{item.reason}}</div>
              </el-row>
              <el-row class="small-gap" type="flex" justify="space-around">
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('teamvalid/'+item.id, {status: 1})"
                >
                  <use xlink:href="#icon-dagou"></use>
                </svg>
                <svg
                  class="icon"
                  style="width:0.875rem; height:0.875rem;"
                  aria-hidden="true"
                  @click="reply('teamvalid/'+item.id, {status: 0})"
                >
                  <use xlink:href="#icon-cha"></use>
                </svg>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TodoPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      teamShare: [],
      seminarShare: [],
      validApply: undefined
    }
  },
  computed: {
    id() {
      return this.$store.state.id
    }
  },
  methods: {
    reply(type, param) {
      this.$http.put('/request/' + type, param).then(
        this.$createToast({
          time: 500,
          txt: '回复成功',
          type: "correct",
          onTimeout: () => {
            this.$http.get('/request/teamshare').then(
              response => {
                response.forEach(res => {
                  this.teamShare = []
                  if (res.receiveCourseTeacherID == this.id) {
                    this.teamShare.push(res)
                  }
                })
              }).catch(error => {
                this.$createToast({
                  time: 500,
                  txt: error.message,
                  type: "error"
                }).show()
              })
            this.$http.get('/request/seminarshare').then(
              response => {
                this.seminarShare = []
                response.forEach(res => {
                  if (res.receiveCourseTeacherID == this.id) {
                    this.seminarShare.push(res)
                  }
                })
              }).catch(error => {
                this.$createToast({
                  time: 500,
                  txt: error.message,
                  type: "error"
                }).show()
              })
            this.$http.get('/request/teamvalid').then(
              response => this.validApply = response
            ).catch(error => {
              this.$createToast({
                time: 500,
                txt: error.message,
                type: "error"
              }).show()
            })
          }
        }).show()
      ).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
  },
  created() {
    this.$http.get('/request/teamshare').then(
      response => {
        response.forEach(res => {
          if (res.receiveCourseTeacherID == this.id) {
            this.teamShare.push(res)
          }
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    this.$http.get('/request/seminarshare').then(
      response => {
        response.forEach(res => {
          if (res.receiveCourseTeacherID == this.id) {
            this.seminarShare.push(res)
          }
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    this.$http.get('/request/teamvalid').then(
      response => this.validApply = response
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
  }
}
</script>
