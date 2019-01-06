<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{seminarInfo.topic+'-成绩'}}</common-sub-header>
    </el-header>
    <el-main>
      <div v-if="role==='teacher'">
        <div v-show="canModify">
          <el-table
            :data="sortedScoreList"
            header-row-class-name="tip-text bold-text"
            row-class-name="tip-text"
          >
            <el-table-column min-width="20%" prop="teamSerial" label="小组" align="left"></el-table-column>
            <el-table-column min-width="20%" prop="presentationScore" label="展示" align="center"></el-table-column>
            <el-table-column min-width="20%" prop="questionScore" label="提问" align="center"></el-table-column>
            <el-table-column min-width="20%" prop="reportScore" label="书面报告" align="center"></el-table-column>
            <el-table-column min-width="20%" prop="sumScore" label="总分" align="center"></el-table-column>
          </el-table>
          <el-row class="normal-gap" type="flex" justify="center">
            <el-col :span="12">
              <el-button plain class="orange-text full-width" @click.native.prevent="modifyScore">修改</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-show="!canModify">
          <el-table :data="sortedScoreList" row-class-name="tip-text" :show-header="false">
            <el-table-column min-width="20%" prop="teamSerial" align="left"></el-table-column>
            <el-table-column min-width="80%" align="left">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="8">
                    <div class="tip-text">展示</div>
                  </el-col>
                  <el-col :span="16">
                    <cube-rate :justify="true" v-model="scope.row.presentationScore"></cube-rate>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="tip-text">提问</div>
                  </el-col>
                  <el-col :span="16">
                    <cube-rate :justify="true" v-model="scope.row.questionScore"></cube-rate>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="tip-text">书面报告</div>
                  </el-col>
                  <el-col :span="16">
                    <cube-rate :justify="true" v-model="scope.row.reportScore"></cube-rate>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="small-gap" type="flex" justify="center">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="confirmScore"
              >确认</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <el-table :data="infoData" :show-header="false">
          <el-table-column min-width="40%" align="left">
            <template slot-scope="scope">
              <div class="content-text bold-text">{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="60%" align="left">
            <template slot-scope="scope">
              <div class="content-text">{{scope.row.content}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarScorePage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      seminarInfo: {
        id: undefined,
        topic: undefined,
        intro: undefined,
        order: undefined
      },
      attendanceData: {
        teamGrade: undefined,
        teamClass: undefined,
        attendanceOrder: undefined,
        presentationScore: undefined,
        reportScore: undefined,
        questionScore: undefined,
        sumScore: undefined
      },
      attendanceList: undefined,
      scoreList: [],
      canModify: true
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
    sortedScoreList() {
      return this.scoreList.sort((a, b) => {
        return a.order - b.order
      })
    },
    infoData() {
      return [{
        title: '主题',
        content: this.seminarInfo.topic
      }, {
        title: '次序',
        content: '第' + this.seminarInfo.order + '次'
      }, {
        title: '要求',
        content: this.seminarInfo.intro
      }, {
        title: '报名情况',
        content: this.attendanceData.attendanceOrder === undefined ? '无' : this.attendanceData.teamGrade + '(' + this.attendanceData.teamClass + ')-' + this.attendanceData.attendanceOrder
      }, {
        title: '展示',
        content: this.attendanceData.presentationScore
      }, {
        title: '提问',
        content: this.attendanceData.questionScore
      }, {
        title: '书面报告',
        content: this.attendanceData.reportScore
      }, {
        title: '总成绩',
        content: this.attendanceData.sumScore
      }]
    }
  },
  methods: {
    confirmScore() {
      this.scoreList.forEach((item, index, array) => {
        this.$http.put('/seminar/' + this.seminarID + '/team/' + item.id + '/seminarscore', {
          presentationScore: item.presentationScore,
          questionScore: item.questionScore,
          reportScore: item.reportScore
        }).then(() => {
          if (index === this.scoreList.length - 1) {
            this.$createToast({
              time: 500,
              txt: '修改成功!',
              type: 'correct',
              onTimeout: () => {
                this.canModify = true
              }
            }).show()
          }
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: 'error'
          }).show()
        })
      })
    },
    modifyScore() {
      this.canModify = false
    }
  },
  created() {
    this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID).then(response => {
      this.seminarInfo.topic = response.topic
      this.seminarInfo.intro = response.intro
      this.seminarInfo.order = response.order
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    if (this.role === 'teacher') {
      this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance').then(response => {
        this.attendanceList = response
        this.attendanceList.forEach((value, index, array) => {
          this.$http.get('/seminar/' + this.seminarID + '/team/' + value.teamID + '/seminarscore').then(response => {
            this.scoreList.push({
              id: value.teamID,
              order: value.teamOrder,
              teamSerial: value.teamOrder + ':' + value.teamNumber,
              presentationScore: response.presentationScore,
              questionScore: response.questionScore,
              reportScore: response.reportScore,
              sumScore: response.totalScore
            })
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    } else {
      this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/seminarscore').then(response => {
        this.attendanceData.questionScore = response.questionScore
        this.attendanceData.presentationScore = response.presentationScore
        this.attendanceData.reportScore = response.reportScore
        this.attendanceData.sumScore = response.totalScore
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
      this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/attendance').then(response => {
        this.attendanceData.attendanceOrder = response.teamOrder
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
      this.$http.get('/class/' + this.classID).then(response => {
        this.attendanceData.teamGrade = response.grade
        this.attendanceData.teamClass = response.klassSerial
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
  }
}
</script>
