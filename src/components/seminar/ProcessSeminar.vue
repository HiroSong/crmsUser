<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName+'-讨论课'}}</common-sub-header>
    </el-header>
    <el-main>
      <div v-if="role==='teacher'">
        <el-row type="flex" justify="end">
          <el-col :span="16">
            <div class="content-text bold-text text-center">{{seminarName}}</div>
          </el-col>
          <el-col :span="4">
            <div
              class="iconfont icon-zanting red-text bold-text"
              style="font-size: 0.875rem"
              @click="pauseSeminar"
            ></div>
          </el-col>
        </el-row>
        <el-row class="small-gap">
          <el-col :span="8">
            <div
              class="red-text bold-text text-start"
              style="font-size: 0.75rem;"
            >{{'第'+curAttendance+'组展示'}}</div>
          </el-col>
          <el-col :span="16">
            <div class="tip-text text-end">{{'已有'+questionNum+'位同学提问'}}</div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <div class="content-text bold-text text-center">{{seminarName}}</div>
        <el-row class="small-gap">
          <el-col :span="8">
            <div
              class="red-text bold-text text-start"
              style="font-size: 0.75rem;"
            >{{'第'+curAttendance+'组展示'}}</div>
          </el-col>
          <el-col :span="16">
            <div class="tip-text text-end">{{'已有'+questionNum+'位同学提问'}}</div>
          </el-col>
        </el-row>
        <el-table :data="attendanceList" :show-header="false">
          <el-table-column min-width="40%" align="left">
            <template slot-scope="scope">
              <div class="content-text bold-text">{{'第'+scope.row.attendanceOrder+'组'}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="60%" align="left">
            <template slot-scope="scope">
              <div
                v-if="scope.row.attendanceOrder===curAttendance"
                class="red-text"
                style="font-size: 0.875rem;"
              >{{scope.row.teamSerial}}</div>
              <div v-else class="content-text">{{scope.row.teamSerial}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="normal-gap" type="flex" justify="center">
          <el-col :span="12">
            <el-button
              plain
              class="orange-text full-width"
              @click.native.prevent="sendQuestion"
            >发起提问</el-button>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import { type } from 'os';

export default {
  name: 'SeminarScorePage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      courseName: 'OOAD',
      seminarName: '业务流程分析',
      questionNum: 1,
      attendanceList: [{
        teamSerial: '1-1',
        attendanceOrder: 1
      }],
      curAttendance: 1,
      scoreData: [{
        teamSerial: '1-1',
        presentationScore: 5,
        questionScore: 5,
        reportScore: 5,
        sumScore: 5
      }]
    }
  },
  computed: {
    role() {
      return 'teacher'
      // return this.$store.state.role
    }
  },
  methods: {
    pauseSeminar() {
      this.$createDialog({
        type: 'confirm',
        content: '确认暂停讨论课吗？',
        onConfirm: () => {
          // 暂停讨论课操作
          this.$router.back()
        }
      }).show()
    },
    sendQuestion() {
      // 学生发起提问
      this.$createToast({
        time: 500,
        txt: '提问已发送',
        type: 'correct'
      }).show()
    },
    // 需要处理学生收到提问的状态
    getQuestion() {
      this.$createDialog({
        type: 'alter',
        content: '请。同学 学号 提问',
        icon: 'cubeic-like'
      }).show()
    }
  }
}
</script>
