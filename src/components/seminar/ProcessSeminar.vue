<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName+'-讨论课'}}</common-sub-header>
    </el-header>
    <el-main>
      <div v-if="role==='teacher'">
        <el-row type="flex" justify="center">
          <div class="content-text bold-text text-center">{{seminarName}}</div>
        </el-row>
        <el-row class="small-gap">
          <el-col :span="12">
            <div
              class="orange-text bold-text text-start"
              style="font-size: 0.75rem;"
            >{{'第'+curAttendance+'组展示'}}</div>
          </el-col>
          <el-col :span="12">
            <div class="tip-text text-end">{{'已有'+questionNum+'位同学提问'}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="tip-text bold-text text-start">{{'已进行'+processTime+'分钟'}}</div>
          </el-col>
          <el-col :span="12">
            <div class="orange-text text-end" style="font-size: 0.75rem" @click="listQuestion">查看</div>
          </el-col>
        </el-row>
        <cube-scroll-nav-bar
          ref="AttendanceNavBar"
          :current="curSelectedAttendance"
          :labels="labels"
          :txts="txts"
          @change="selectAttendance"
        />
        <div v-if="isPresentation">
          <div class="tip-text bold-text text-center normal-gap">展示分数</div>
          <el-row class="small-gap">
            <el-col :span="16" :offset="4">
              <cube-rate v-model="attendanceList[curSelectedAttendance].score"></cube-rate>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <div class="tip-text bold-text text-center normal-gap">提问分数</div>
          <div class="tip-text text-center small-gap">{{questionList[curSelectedQuestion]}}</div>
          <el-row class="small-gap">
            <el-col :span="16" :offset="4">
              <cube-rate v-model="questionScoreList[curSelectedQuestion]"></cube-rate>
            </el-col>
          </el-row>
        </div>
        <el-row
          v-if="curSelectedAttendance!==curAttendance||curSelectedQuestion!==curQuestion"
          class="normal-gap"
          type="flex"
          justify="center"
        >
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="modifyScore">修改分数</el-button>
          </el-col>
        </el-row>
        <el-row class="normal-gap" type="flex" justify="center">
          <el-col :span="12">
            <el-button
              plain
              class="orange-text full-width"
              @click.native.prevent="nextQuestion"
            >抽取问题</el-button>
          </el-col>
        </el-row>
        <el-row class="small-gap" type="flex" justify="center">
          <el-col :span="12">
            <el-button
              plain
              class="orange-text full-width"
              @click.native.prevent="nextAttendance"
            >下组展示</el-button>
          </el-col>
        </el-row>
        <cube-drawer
          ref="questionDrawer"
          title="提问列表"
          :data="questionData"
          class="content-text"
          @select="selectQuestion"
        ></cube-drawer>
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
      attendanceList: [{
        teamSerial: '1-1',
        attendanceOrder: 1,
        score: 0
      }, {
        teamSerial: '1-2',
        attendanceOrder: 2,
        score: 0
      }, {
        teamSerial: '1-3',
        attendanceOrder: 3,
        score: 0
      }],
      curAttendance: 1,
      curSelectedAttendance: 0,
      curQuestion: 0,
      curSelectedQuestion: 0,
      questionList: ['组号' + ' ' + '姓名', '111'],
      questionData: [[]],
      questionScoreList: [0, 0],
      isPresentation: true,
      reportEndTime: undefined,
      processTime: 0
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    labels() {
      let orderList = []
      this.attendanceList.forEach((value, index, array) => {
        orderList.push(value.attendanceOrder - 1)
      })
      return orderList
    },
    txts() {
      let teamList = []
      this.attendanceList.forEach((value, index, array) => {
        teamList.push(value.attendanceOrder + ':' + value.teamSerial)
      })
      return teamList
    },
    questionNum() {
      return this.questionList.length
    }
  },
  methods: {
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
    },
    listQuestion() {
      this.$refs.questionDrawer.refill(0, this.questionList)
      this.$refs.questionDrawer.show()
    },
    selectAttendance(cur) {
      if (cur > this.curAttendance) {
        this.$refs.AttendanceNavBar.active = this.curSelectedAttendance
        this.$createToast({
          type: 'warn',
          time: 500,
          txt: '该展示未开始！'
        }).show()
      } else {
        this.isPresentation = true
        this.curSelectedAttendance = cur
      }
    },
    selectQuestion(selectedVal, selectedIndex, selectedText) {
      if (selectedIndex > this.curQuestion) {
        this.$createToast({
          type: 'warn',
          time: 500,
          txt: '该提问未开始！'
        }).show()
      } else {
        this.isPresentation = false
        this.curSelectedQuestion = selectedIndex
      }
    },
    nextQuestion() {
      // 更新提问列表
      if (this.curSelectedQuestion + 1 === this.questionList.length) {
        this.$createToast({
          time: 500,
          txt: '当前已无新提问',
          type: 'warn'
        }).show()
      } else {
        this.isPresentation = false
        this.curQuestion += 1
        this.curSelectedQuestion = this.curQuestion
      }
    },
    showEndTimePicker() {
      this.$createDatePicker({
        title: '截止时间',
        min: new Date(),
        max: new Date(2020, 9, 20, 20, 59, 59),
        value: new Date(),
        columnCount: 6,
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'dd',
          hour: 'hh',
          minute: 'mm',
          second: 'ss'
        },
        onSelect: (date, selectedVal, selectedText) => {
          selectedText = this.$datetimeFormat.format(selectedText)
          this.$createDialog({
            type: 'confirm',
            title: '提示',
            content: '确定将报告提交截止时间设置为' + this.$datetimeFormat.toPretty(selectedText) + '吗？',
            onConfirm: () => {
              this.reportEndTime = selectedText
              // 设置
              this.$createToast({
                type: 'correct',
                time: 500,
                txt: '设置成功！',
                onTimeout: () => {
                  this.$router.back()
                }
              }).show()
            },
            onCancel: () => {
              this.$createDialog({
                type: 'confirm',
                title: '提示',
                content: '默认将报告提交截止时间设置为' + this.$datetimeFormat.toPretty(this.$datetimeFormat.getToday()) + '，确定吗？',
                onConfirm: () => {
                  this.reportEndTime = selectedText
                  // 设置
                  this.$createToast({
                    type: 'correct',
                    time: 500,
                    txt: '设置成功！',
                    onTimeout: () => {
                      this.$router.back()
                    }
                  }).show()
                },
                onCancel: () => {
                  this.$createToast({
                    type: 'warn',
                    time: 500,
                    txt: '请重新设置！',
                    onTimeout: () => {
                      this.showEndTimePicker()
                    }
                  }).show()
                }
              }).show()
            }
          }).show()
        },
        onCancel: (date, selectedVal, selectedText) => {
          this.$createDialog({
            type: 'confirm',
            title: '提示',
            content: '默认将报告提交截止时间设置为' + this.$datetimeFormat.toPretty(this.$datetimeFormat.getToday()) + '，确定吗？',
            onConfirm: () => {
              this.reportEndTime = selectedText
              // 设置
              this.$createToast({
                type: 'correct',
                time: 500,
                txt: '设置成功！',
                onTimeout: () => {
                  this.$router.back()
                }
              }).show()
            },
            onCancel: () => {
              this.$createToast({
                type: 'warn',
                time: 500,
                txt: '请重新设置！',
                onTimeout: () => {
                  this.showEndTimePicker()
                }
              }).show()
            }
          }).show()
        }
      }).show()
    },
    nextAttendance() {
      if (this.curSelectedAttendance + 1 === this.attendanceList.length) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: '确定要结束讨论课吗？',
          onConfirm: () => {
            this.$createDialog({
              type: 'alter',
              title: '讨论课已结束',
              content: '请设置报告提交截止时间',
              onConfirm: () => {
                this.showEndTimePicker()
              }
            }).show()
          }
        }).show()
      } else {
        this.processTime = 0
        this.isPresentation = true
        this.curAttendance += 1
        this.curSelectedAttendance = this.curAttendance - 1
      }
    },
    modifyScore() {
      this.$createToast({
        type: 'correct',
        time: 500,
        txt: '修改成功!'
      }).show()
    }
  }
}
</script>
