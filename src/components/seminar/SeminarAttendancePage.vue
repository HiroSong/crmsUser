<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{seminarName}}</common-sub-header>
    </el-header>
    <el-main>
      <el-table :data="attendanceList" :show-header="false">
        <el-table-column min-width="40%" align="left">
          <template slot-scope="scope">
            <div class="content-text">{{'第'+scope.row.teamOrder+'组'}}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="60%" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.teamNumber===undefined&&seminarStatus==='未开始'">
              <div
                v-if="role!=='teacher'"
                class="el-icon-circle-plus-outline green-text"
                style="font-size:0.875rem;"
                @click="regiestSeminar(scope.row.teamOrder)"
              >&nbsp;报名</div>
            </div>
            <div v-else-if="scope.row.id!==undefined">
              <div v-if="seminarStatus==='未开始'">
                <div
                  v-if="scope.row.pptUrl===undefined"
                  class="red-text"
                  style="font-size:0.875rem;"
                >{{scope.row.teamNumber+' 未提交'}}</div>
                <div v-else class="context-text">{{scope.row.teamNumber+' '+scope.row.pptName}}</div>
              </div>
              <div v-else-if="seminarStatus==='正在进行'">
                <div
                  v-if="scope.row.pptUrl===undefined"
                  class="red-text"
                  style="font-size:0.875rem;"
                >{{scope.row.teamNumber+' 未提交'}}</div>
                <a
                  v-else
                  :id="scope.row.teamNumber"
                  class="green-text"
                  style="font-size:0.875rem;"
                  :href="scope.row.pptUrl"
                  :download="scope.row.pptName"
                >{{scope.row.teamNumber+' '+scope.row.pptName}}</a>
              </div>
              <div v-else>
                <div class="conent-text">{{scope.row.teamNumber}}</div>
              </div>
            </div>
            <div v-else>
              <div class="conent-text">无</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        v-show="hasAttendance&&seminarStatus==='未开始'&&role!=='teacher'"
        class="normal-gap"
        type="flex"
        justify="center"
      >
        <el-col :span="12">
          <el-button
            type="danger"
            plain
            class="full-width"
            @click.native.prevent="cancleRegiest"
          >取消报名</el-button>
        </el-col>
      </el-row>
      <!-- <el-row
        v-if="role==='teacher'&&seminarStatus==='正在进行'"
        class="normal-gap"
        type="flex"
        justify="center"
      >
        <el-col :span="12">
          <el-button
            plain
            class="orange-text full-width"
            @click.native.prevent="downloadAllPPT"
          >批量下载</el-button>
        </el-col>
      </el-row>-->
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarAttendancePage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      teamLimit: undefined,
      seminarName: undefined,
      seminarStatus: '未开始',
      attendanceList: [],
      attendanceID: undefined
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
    teamID() {
      return this.$route.query.teamID
    },
    hasAttendance() {
      return this.attendanceID === undefined ? false : true
    }
  },
  methods: {
    regiestSeminar(order) {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定报名该次讨论课吗？',
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
          if (this.hasAttendance) {
            this.$http.delete('/attendance/' + this.attendanceID).then(() => {
              this.$http.post('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance/', {
                teamID: this.teamID,
                teamOrder: order
              }).then(() => {
                this.updateData()
                this.$createToast({
                  time: 500,
                  txt: '报名成功',
                  type: "correct",
                  onTimeout: () => {
                    this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/attendance').then(response => {
                      this.attendanceID = response.id
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
            }).catch(error => {
              this.$createToast({
                time: 500,
                txt: error.message,
                type: "error"
              }).show()
            })
          } else {
            this.$http.post('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance/', {
              teamID: this.teamID,
              teamOrder: order
            }).then(() => {
              this.updateData()
              this.$createToast({
                time: 500,
                txt: '报名成功',
                type: "correct",
                onTimeout: () => {
                  this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/attendance').then(response => {
                    this.attendanceID = response.id
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
        }
      }).show()
    },
    cancleRegiest() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定取消报名吗？',
        confirmBtn: {
          text: '确定',
          active: false,
          disabled: false
        },
        cancelBtn: {
          text: '放弃',
          active: true,
          disabled: false
        },
        onConfirm: () => {
          this.$http.delete('/attendance/' + this.attendanceID).then(() => {
            this.$createToast({
              time: 500,
              txt: '取消成功',
              type: "correct",
              onTimeout: () => {
                this.attendanceID = undefined
                this.updateData()
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
    updateData() {
      this.attendanceList = []
      this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance').then(response => {
        response.forEach((item, index, array) => {
          this.$http.get('/attendance/' + item.id + '/ppt').then(res => {
            this.attendanceList.push({
              id: item.id,
              teamOrder: item.teamOrder,
              teamNumber: item.teamNumber,
              pptName: res.name === null ? undefined : res.name,
              pptUrl: res.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/ppt/' + res.url
            })
            if (this.attendanceList.length === response.length) {
              let tempList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
              let curIndex = 1
              tempList.forEach(item => {
                while (item.teamOrder > curIndex) {
                  this.attendanceList.push({
                    id: undefined,
                    teamOrder: curIndex,
                    teamNumber: undefined,
                    pptName: undefined,
                    pptUrl: undefined
                  })
                  curIndex++
                }
                curIndex++
              })
              while (curIndex < this.teamLimit) {
                this.attendanceList.push({
                  id: undefined,
                  teamOrder: curIndex,
                  teamNumber: undefined,
                  pptName: undefined,
                  pptUrl: undefined
                })
                curIndex++
              }
              this.attendanceList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
            }
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        })
        if (response.length === 0) {
          for (var i = 0; i < this.teamLimit; i++) {
            this.attendanceList.push({
              id: undefined,
              teamOrder: i + 1,
              teamNumber: undefined,
              pptName: undefined,
              pptUrl: undefined
            })
          }
        }
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    },
    downloadPPT(id) {
      var e = document.createEvent("MouseEvents")
      e.initEvent("click", false, false)
      document.getElementById(id).dispatchEvent(e)
      document.getElementById(id).click()
    },
    downloadAllPPT() {
      this.attendanceList.forEach(item => {
        if (item.pptUrl !== undefined) {
          this.downloadPPT(item.teamNumber)
          sleep(1000)
        }
      })
    }
  },
  created() {
    if (this.role === 'student') {
      this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/attendance').then(response => {
        this.attendanceID = response.id
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
    this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID).then(seminarInfo => {
      this.seminarName = seminarInfo.topic
      let status = seminarInfo.status
      if (status === 0) {
        this.seminarStatus = "未开始"
      } else if (status === 1) {
        this.seminarStatus = "正在进行"
      } else {
        this.seminarStatus = "已结束"
      }
      this.teamLimit = seminarInfo.teamNumLimit
      this.updateData()
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
