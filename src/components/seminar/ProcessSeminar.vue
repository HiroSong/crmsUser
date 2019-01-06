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
            >{{'第'+attendanceList[curAttendance].teamOrder+'组展示'}}</div>
          </el-col>
          <el-col :span="12">
            <div class="tip-text text-end">{{'已有'+questionNum+'位同学提问'}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="16">
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
              <cube-rate v-model="presentationScoreList[curSelectedAttendance]"></cube-rate>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <div class="tip-text bold-text text-center normal-gap">提问分数</div>
          <div class="tip-text text-center small-gap">{{questionList[curSelectedQuestion].label}}</div>
          <el-row class="small-gap">
            <el-col :span="16" :offset="4">
              <cube-rate v-model="questionScoreList[curSelectedQuestion]"></cube-rate>
            </el-col>
          </el-row>
        </div>
        <el-row
          v-if="((isPresentation&&curSelectedAttendance!==curAttendance)||(!isPresentation&&curSelectedQuestion!==curQuestion))"
          class="normal-gap"
          type="flex"
          justify="center"
        >
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="modifyScore">修改分数</el-button>
          </el-col>
        </el-row>
        <el-row v-else class="normal-gap" type="flex" justify="center">
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="modifyScore">确认</el-button>
          </el-col>
        </el-row>
        <el-row class="small-gap" type="flex" justify="center">
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
          title=" "
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
            >{{'第'+attendanceList[curAttendance].teamOrder+'组展示'}}</div>
          </el-col>
          <el-col :span="16">
            <div class="tip-text text-end">{{'已有'+questionNum+'位同学提问'}}</div>
          </el-col>
        </el-row>
        <el-table :data="tempList" :show-header="false">
          <el-table-column min-width="40%" align="left">
            <template slot-scope="scope">
              <div class="content-text bold-text">{{'第'+scope.row.teamOrder+'组'}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="60%" align="left">
            <template slot-scope="scope">
              <div
                v-if="beInTurn(scope.row.teamOrder)"
                class="red-text"
                style="font-size: 0.875rem;"
              >{{scope.row.teamNumber}}</div>
              <div v-else class="content-text">{{scope.row.teamNumber}}</div>
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
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import CommonSubHeader from '@/components/common/CommonSubHeader'
import { type } from 'os';

export default {
  name: 'SeminarScorePage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      courseName: undefined,
      seminarName: undefined,
      attendanceList: [],
      tempList: [],
      curAttendance: 0,
      curSelectedAttendance: 0,
      curSelectedQuestion: 0,
      questionNum: 0,
      totalQuestionList: [],
      questionList: [],
      questionData: [[]],
      questionScoreList: [0, 0],
      presentationScoreList: [],
      isPresentation: true,
      reportEndTime: undefined,
      timer: undefined,
      stompInitClient: undefined,
      teamID: undefined,
      WS_API: 'http://47.107.69.160:8080/gs-guide-websocket',
      // WS_API: 'http://localhost:8080/gs-guide-websocket',
      headers: {
        Authorization: 'Bearer ' + this.$store.state.token
      }
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    seminarID() {
      return this.$route.query.seminarID
    },
    classID() {
      return this.$route.query.classID
    },
    courseID() {
      return this.$route.query.courseID
    },
    labels() {
      let orderList = []
      this.attendanceList.forEach((value, index, array) => {
        orderList.push(index)
      })
      return orderList
    },
    txts() {
      let teamList = []
      this.attendanceList.forEach((value, index, array) => {
        teamList.push(value.teamOrder + ':' + value.teamNumber)
      })
      return teamList
    },
    beInTurn() {
      return (order) => this.attendanceList[this.curAttendance].teamOrder === order
    },
    curQuestion() {
      return this.questionList.length - 1
    },
    inSameTeam() {
      return this.teamID === this.attendanceList[this.curAttendance].teamID
    },
    hasQuestioned() {
      let result = false
      this.totalQuestionList.forEach((val, index, arr) => {
        if (parseInt(val) === parseInt(this.$store.state.id)) {
          result = true
        }
      })
      return result
    }
  },
  methods: {
    sendQuestion() {
      if (this.hasQuestioned) {
        this.$createToast({
          time: 500,
          txt: '本次展示您已提问过',
          type: 'warn'
        }).show()
      } else if (this.inSameTeam) {
        this.$createToast({
          time: 500,
          txt: '不能提问自己的小组',
          type: 'warn'
        }).show()
      } else {
        this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/question', this.headers, JSON.stringify({
          'studentID': this.$store.state.id,
          'attendanceID': this.attendanceList[this.curAttendance].id
        }))
        this.$createToast({
          time: 500,
          txt: '提问已发送',
          type: 'correct'
        }).show()
      }
    },
    getQuestion(teamNumber, studentName) {
      this.$createDialog({
        type: 'alter',
        content: '请' + studentName + '同学(' + teamNumber + ')提问',
        icon: 'cubeic-like'
      }).show()
    },
    listQuestion() {
      let questions = []
      this.tempList.forEach(item => {
        questions.push(item.label)
      })
      this.$refs.questionDrawer.refill(0, questions)
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
      this.isPresentation = false
      this.curSelectedQuestion = selectedIndex
    },
    nextQuestion() {
      if (this.questionNum === 0) {
        this.$createToast({
          time: 500,
          txt: '当前已无新提问',
          type: 'warn'
        }).show()
      } else {
        if (this.curQuestion === -1) {
          this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/selectquestion', this.headers, {})
        } else {
          if (this.questionScoreList[this.curQuestion] === undefined) {
            this.questionScoreList[this.curQuestion] = 0
          }
          this.$http.put('/seminar/' + this.seminarID + '/team/' + this.questionList[this.curQuestion].teamID + '/questionscore', {
            questionScore: this.questionScoreList[this.curQuestion]
          }).then(() => {
            this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/question/' + this.questionList[this.curQuestion].order + '/' + this.questionScoreList[this.curQuestion], this.headers, {})
            this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/selectquestion', this.headers, {})
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
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
              this.$http.put('/seminar/' + this.seminarID + '/class/' + this.classID + '/reportddl', {
                reportDDL: this.reportEndTime
              }).then(() => {
                this.$createToast({
                  type: 'correct',
                  time: 500,
                  txt: '设置成功！',
                  onTimeout: () => {
                    this.$router.back()
                  }
                }).show()
              }).catch(error => {
                this.$createToast({
                  time: 500,
                  txt: error.message,
                  type: "error"
                })
              })
            },
            onCancel: () => {
              this.$createDialog({
                type: 'confirm',
                title: '提示',
                content: '默认将报告提交截止时间设置为' + this.$datetimeFormat.toPretty(this.$datetimeFormat.getToday()) + '，确定吗？',
                onConfirm: () => {
                  this.reportEndTime = selectedText
                  this.$http.put('/seminar/' + this.seminarID + '/class/' + this.classID + '/reportddl', {
                    reportDDL: this.reportEndTime
                  }).then(() => {
                    this.$createToast({
                      type: 'correct',
                      time: 500,
                      txt: '设置成功！',
                      onTimeout: () => {
                        this.$router.back()
                      }
                    }).show()
                  }).catch(error => {
                    this.$createToast({
                      time: 500,
                      txt: error.message,
                      type: "error"
                    })
                  })
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
              this.reportEndTime = this.$datetimeFormat.getToday()
              this.$http.put('/seminar/' + this.seminarID + '/class/' + this.classID + '/reportddl', {
                reportDDL: this.reportEndTime
              }).then(() => {
                this.$createToast({
                  type: 'correct',
                  time: 500,
                  txt: '设置成功！',
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
            if (this.presentationScoreList[this.curAttendance] === undefined) {
              this.presentationScoreList[this.curAttendance] = 0
            }
            this.$http.put('/seminar/' + this.seminarID + '/team/' + this.attendanceList[this.curAttendance].teamID + '/presentationscore', {
              presentationScore: this.presentationScoreList[this.curAttendance]
            }).then(() => {
              this.$http.put('/seminar/' + this.seminarID + '/class/' + this.classID + '/status', { status: 2 }).then(() => {
                this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/finish', this.headers, {})
                this.$createDialog({
                  type: 'alter',
                  title: '讨论课已结束',
                  content: '请设置报告提交截止时间',
                  onConfirm: () => {
                    this.showEndTimePicker()
                  }
                }).show()
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
        }).show()
      } else {
        if (this.presentationScoreList[this.curAttendance] === undefined) {
          this.presentationScoreList[this.curAttendance] = 0
        }
        this.$http.put('/seminar/' + this.seminarID + '/team/' + this.attendanceList[this.curAttendance].teamID + '/presentationscore', {
          presentationScore: this.presentationScoreList[this.curAttendance]
        }).then(() => {
          this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/process/attendance', this.headers, JSON.stringify({
            'newAttendanceID': this.attendanceList[this.curAttendance + 1].id,
            'oldAttendanceID': this.attendanceList[this.curAttendance].id
          }))
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      }
    },
    modifyScore() {
      if (this.isPresentation) {
        if (this.presentationScoreList[this.curSelectedAttendance] === undefined) {
          this.presentationScoreList[this.curSelectedAttendance] = 0
        }
        this.$http.put('/seminar/' + this.seminarID + '/team/' + this.attendanceList[this.curSelectedAttendance].teamID + '/presentationscore', {
          presentationScore: this.presentationScoreList[this.curSelectedAttendance]
        }).then(() => {
          this.$createToast({
            type: 'correct',
            time: 500,
            txt: '打分成功!'
          }).show()
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      } else {
        if (this.questionScoreList[this.curSelectedQuestion] === undefined) {
          this.questionScoreList[this.curSelectedQuestion] = 0
        }
        this.$http.put('/seminar/' + this.seminarID + '/team/' + this.questionList[this.curSelectedQuestion].teamID + '/questionscore', {
          questionScore: this.questionScoreList[this.curSelectedQuestion]
        }).then(() => {
          this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/question/' + this.questionList[this.curSelectedQuestion].order + '/' + this.questionScoreList[this.curSelectedQuestion], this.headers, {})
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      }
    },
    initQuestionScore() {
      this.questionScoreList = []
      this.questionList.forEach((item, index, arr) => {
        this.$set(this.questionScoreList, index, item.score)
      })
    },
    initWebSocket() {
      this.initConnection()
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/test', this.headers, {})
        } catch (err) {
          this.initConnection()
        }
      }, 5000)
    },
    initConnection() {
      let socket = new SockJS(this.WS_API);
      this.stompInitClient = Stomp.over(socket);
      this.stompInitClient.connect(this.headers, () => {
        this.stompInitClient.subscribe("/topic/seminar/" + this.seminarID + '/class/' + this.classID, (msg) => {
          var response = JSON.parse(msg.body)
          if (response.type === 'join') {
            this.questionNum = response.questionNumber
            if (this.role === 'teacher') {
              this.questionList = []
              response.questionSelectedQueue.forEach(item => {
                this.questionList.push({
                  teamID: item.teamID,
                  order: item.order,
                  label: item.teamNumber + '-' + item.studentName,
                  score: item.score
                })
              })
              this.questionList = this.questionList.sort((a, b) =>
                a.order - b.order
              )
              this.initQuestionScore()
            } else {
              this.totalQuestionList = []
              response.questionSelectedQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
              response.questionQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
            }
          } else if (response.type === 'question') {
            this.questionNum = response.questionNumber
            if (this.role === 'student') {
              this.totalQuestionList = []
              response.questionSelectedQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
              response.questionQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
            }
          } else if (response.type === 'selectQuestion') {
            this.questionNum = response.questionNumber
            if (this.role === 'teacher') {
              this.isPresentation = false
              this.questionList = []
              response.questionSelectedQueue.forEach(item => {
                this.questionList.push({
                  teamID: item.teamID,
                  order: item.order,
                  label: item.teamNumber + '-' + item.studentName,
                  score: item.score
                })
              })
              this.questionList = this.questionList.sort((a, b) =>
                a.order - b.order
              )
              this.initQuestionScore()
              this.curQuestion += 1
              this.curSelectedQuestion = this.curQuestion
            } else {
              this.totalQuestionList = []
              response.questionSelectedQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
              response.questionQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
            }
            var selectedQuestion = response.selectedQuestion
            this.getQuestion(selectedQuestion.teamNumber, selectedQuestion.studentName)
          } else if (response.type === 'score') {
            if (this.role === 'teacher') {
              this.$createToast({
                type: 'correct',
                time: 500,
                txt: '打分成功!'
              }).show()
            }
          } else if (response.type === 'attendance') {
            this.questionNum = response.questionNumber
            if (this.role === 'teacher') {
              this.questionList = []
              response.questionSelectedQueue.forEach(item => {
                this.questionList.push({
                  teamID: item.teamID,
                  order: item.order,
                  label: item.teamNumber + '-' + item.studentName,
                  score: item.score
                })
              })
              this.questionList = this.questionList.sort((a, b) =>
                a.order - b.order
              )
              this.initQuestionScore()
            } else {
              this.totalQuestionList = []
              response.questionSelectedQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
              response.questionQueue.forEach(item => {
                this.totalQuestionList.push(item.studentID)
              })
            }
            this.curAttendance += 1
            this.curSelectedAttendance = this.curAttendance
            if (this.role === 'teacher') {
              this.isPresentation = true
            }
          } else if (response.type === 'finish') {
            if (this.role === 'student') {
              this.$createDialog({
                type: 'alter',
                title: '提示',
                content: '讨论课已结束',
                onConfirm: () => {
                  this.$router.back()
                }
              }).show()
            }
          }
        }, this.headers)
        this.stompInitClient.send('/app/seminar/' + this.seminarID + '/class/' + this.classID + '/join', this.headers, {})
      }, (err) => {
        console.log('失败')
        console.log(err)
      });
    },
    disconnect() {
      if (this.stompInitClient) {
        this.stompInitClient.disconnect()
      }
    }
  },
  created() {
    if (this.role === 'student') {
      this.$http.get('/course/' + this.courseID + '/myTeam').then(response => {
        this.teamID = response.id
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
    this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/enter').then(() => {
      this.initWebSocket()
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/seminar/' + this.seminarID).then(response => {
      this.seminarName = response.topic
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/course/' + this.courseID).then(response => {
      this.courseName = response.name
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance').then(response => {
      this.attendanceList = response
      this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
      this.attendanceList.forEach((val, index, arr) => {
        if (val.bePresent === 1) {
          this.curAttendance = index
          this.curSelectedAttendance = this.curAttendance
        }
      })
      if (this.role === 'student') {
        this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID).then(seminarInfo => {
          this.teamLimit = seminarInfo.teamNumLimit
          this.tempList = this.attendanceList
          let curIndex = 1
          this.attendanceList.forEach(item => {
            while (item.teamOrder > curIndex) {
              this.tempList.push({
                id: undefined,
                teamOrder: curIndex,
                teamNumber: undefined
              })
              curIndex++
            }
            curIndex++
          })
          while (curIndex < this.teamLimit) {
            this.tempList.push({
              id: undefined,
              teamOrder: curIndex,
              teamNumber: undefined
            })
            curIndex++
          }
          this.tempList = this.tempList.sort((a, b) => a.teamOrder - b.teamOrder)
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      } else {
        this.presentationScoreList = []
        this.attendanceList.forEach((val, index, arr) => {
          this.$http.get('/seminar/' + this.seminarID + '/team/' + val.teamID + '/seminarscore').then(res => {
            this.$set(this.presentationScoreList, index, res.presentationScore)
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        })
      }
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
  },
  beforeDestroy() {
    this.disconnect()
    clearInterval(this.timer)
  }
}
</script>
