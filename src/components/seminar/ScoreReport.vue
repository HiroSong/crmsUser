<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">{{seminarName+'-书面报告'}}</common-sub-header>
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
            <div v-if="scope.row.teamNumber!==undefined">
              <el-row>
                <div
                  v-if="scope.row.reportUrl===undefined"
                  class="red-text"
                  style="font-size:0.875rem;"
                >{{scope.row.teamNumber+' 未提交'}}</div>
                <a
                  v-else
                  class="green-text"
                  style="font-size:0.875rem;"
                  :href="scope.row.reportUrl"
                  :download="scope.row.reportName"
                >{{scope.row.teamNumber+' '+scope.row.reportName}}</a>
              </el-row>
              <el-row>
                <cube-rate :justify="true" v-model="scope.row.reportScore"></cube-rate>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-row class="normal-gap" type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="orange-text full-width"
            @click.native.prevent="downloadReport"
          >批量下载</el-button>
        </el-col>
      </el-row>-->
      <el-row class="normal-gap" type="flex" justify="center">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="submitScore">确认</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarReportPage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      teamLimit: 0,
      seminarName: "",
      attendanceList: []
    }
  },
  computed: {
    seminarID() {
      return this.$route.query.seminarID
    },
    classID() {
      return this.$route.query.classID
    }
  },
  methods: {
    getScore() {
      this.attendanceList.forEach((item, index, arr) => {
        if (item.id !== undefined) {
          this.$http.get('/seminar/' + this.seminarID + '/team/' + item.teamID + '/seminarscore').then(response => {
            this.attendanceList[index].reportScore = response.reportScore
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
      })
    },
    submitScore() {
      let curScore = 0
      this.attendanceList.forEach(item => {
        if (item.id === undefined) {
          curScore += 1
          if (curScore === this.attendanceList.length) {
            this.$createToast({
              time: 500,
              txt: '成绩提交成功！',
              type: 'correct'
            }).show()
          }
        } else {
          this.$http.put('/seminar/' + this.seminarID + '/team/' + item.teamID + '/reportscore', {
            reportScore: item.reportScore
          }).then(() => {
            curScore += 1
            if (curScore === this.attendanceList.length) {
              this.$createToast({
                time: 500,
                txt: '成绩提交成功！',
                type: 'correct'
              }).show()
            }
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
      })
    },
    updateData() {
      this.attendanceList = []
      this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance').then(response => {
        response.forEach((item, index, array) => {
          this.$http.get('/attendance/' + item.id + '/report').then(res => {
            this.attendanceList.push({
              id: item.id,
              teamID: item.teamID,
              teamOrder: item.teamOrder,
              teamNumber: item.teamNumber,
              reportName: res.name === null ? undefined : res.name,
              reportUrl: res.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/report/' + res.url,
              reportScore: 0
            })
            if (this.attendanceList.length === response.length) {
              let tempList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
              let curIndex = 1
              tempList.forEach(item => {
                while (item.teamOrder > curIndex) {
                  this.attendanceList.push({
                    id: undefined,
                    teamID: undefined,
                    teamOrder: curIndex,
                    teamNumber: undefined,
                    reportName: undefined,
                    reportUrl: undefined,
                    reportScore: undefined
                  })
                  curIndex++
                }
                curIndex++
              })
              while (curIndex < this.teamLimit) {
                this.attendanceList.push({
                  id: undefined,
                  teamID: undefined,
                  teamOrder: curIndex,
                  teamNumber: undefined,
                  reportName: undefined,
                  reportUrl: undefined,
                  reportScore: undefined
                })
                curIndex++
              }
              this.attendanceList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
              this.getScore()
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
              teamID: undefined,
              teamOrder: i,
              teamNumber: undefined,
              reportName: undefined,
              reportUrl: undefined,
              reportScore: undefined
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
    }
  },
  created() {
    this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID).then(seminarInfo => {
      this.seminarName = seminarInfo.topic
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
