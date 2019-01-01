<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">新增共享</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-row>
        <div class="content-text">共享类型:</div>
      </el-row>
      <el-row class="small-gap">
        <el-select
          v-model="selectedType"
          placeholder="请选择共享类型"
          class="content-text full-width"
          size="small"
        >
          <el-option value="1" label="共享讨论课"></el-option>
          <el-option value="2" label="共享分组"></el-option>
        </el-select>
      </el-row>
      <el-row class="small-gap">
        <div class="content-text">共享对象:</div>
      </el-row>
      <el-row class="small-gap">
        <el-select
          v-model="selectedCourse"
          filterable
          placeholder="请输入教师/课程名称"
          class="content-text full-width"
          size="small"
          no-data-text="暂时没有课程可选"
        >
          <el-option
            v-for="item in courseList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            class="content-text"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="confirmSharing"
          >确认共享</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import { create } from 'domain';

export default {
  name: 'CreateApplicationPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      selectedType: undefined,
      selectedCourse: undefined,
      teamCourseList: [],
      seminarCourseList: []
    }
  },
  computed: {
    courseID() {
      return this.$route.query.courseID
    },
    courseList() {
      if (this.selectedType === '1') {
        return this.seminarCourseList
      } else if (this.selectedType === '2') {
        return this.teamCourseList
      } else {
        return []
      }
    }
  },
  methods: {
    confirmSharing() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定发起共享吗？',
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
          let url = this.selectedType === '1' ? '/request/seminarshare' : '/request/teamshare'
          this.$http.post(url, { mainCourseID: this.courseID, subCourseID: this.selectedCourse }).then(
            response => {
              this.$createToast({
                time: 500,
                txt: '共享请求已发送',
                type: 'correct',
                onTimeout: () => {
                  this.$router.back()
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
    }
  },
  created() {
    this.$http.get('/allcourse').then(
      response => {
        this.$http.get('/course/' + this.courseID + '/teamshare').then(
          res => {
            let teamCourses = response.filter(item => {
              if (res.length !== 0) {
                return res.every(course => item.id !== course.masterCourse.masterCourseID && item.id !== course.receiveCourse.receiveCourseID && item.id !== this.courseID)
              } else {
                return item.id !== this.courseID
              }
            })
            teamCourses.forEach(item => {
              this.teamCourseList.push({
                value: item.id,
                label: item.courseName + '(' + item.teacher.name + ')'
              })
            })
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        this.$http.get('/course/' + this.courseID + '/seminarshare').then(
          res => {
            let seminarCourses = response.filter(item => {
              if (res.length !== 0) {
                return res.every(course => item.id !== course.masterCourse.masterCourseID && item.id !== course.receiveCourse.receiveCourseID && item.id !== this.courseID)
              } else {
                return item.id != this.courseID
              }
            })
            seminarCourses.forEach(item => {
              this.seminarCourseList.push({
                value: item.id,
                label: item.courseName + '(' + item.teacher.name + ')'
              })
            })
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
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
