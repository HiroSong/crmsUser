<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header v-if="role==='teacher'" :role="role" :is-mobile="true">学生成绩</common-sub-header>
      <common-sub-header v-else :role="role" :is-mobile="true">{{modifiedTitle}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div v-if="tableData.length!==0">
        <div v-if="role==='teacher'">
          <el-collapse :accordion="true">
            <el-collapse-item
              v-for="(items,index) in totalScoreInfo"
              :key="index"
              @click.native="searchTeam(items)"
            >
              <template slot="title">
                <div class="sub-title-text">{{'第'+items.round+'轮'}}</div>
              </template>
              <el-collapse :accordion="true">
                <el-collapse-item
                  v-for="(item,ind) in items.teamList"
                  :key="ind"
                  @click.native="searchScore(items,item)"
                >
                  <template slot="title">
                    <div class="content-text more-text">{{item.teamName+' ('+item.roundScore+')'}}</div>
                  </template>
                  <div v-for="(seminar, seminarInd) in item.score" :key="seminarInd">
                    <el-row>
                      <div class="content-text text-center">{{seminar.seminarName}}</div>
                    </el-row>
                    <div v-if="needModify&&seminar.seminarName!=='本轮次成绩'">
                      <el-row>
                        <el-col :span="8" :offset="3">
                          <div class="tip-text">展示:</div>
                        </el-col>
                        <el-col :span="10">
                          <cube-rate v-model="seminar.presentationScore" :justify="true"></cube-rate>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" :offset="3">
                          <div class="tip-text">提问:</div>
                        </el-col>
                        <el-col :span="10">
                          <cube-rate v-model="seminar.questionScore" :justify="true"></cube-rate>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" :offset="3">
                          <div class="tip-text">书面报告:</div>
                        </el-col>
                        <el-col :span="10">
                          <cube-rate v-model="seminar.reportScore" :justify="true"></cube-rate>
                        </el-col>
                      </el-row>
                    </div>
                    <el-row v-else>
                      <el-col :span="8">
                        <div class="tip-text text-center">展示:{{seminar.presentationScore}}</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="tip-text text-center">提问:{{seminar.questionScore}}</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="tip-text text-center">书面报告:{{seminar.reportScore}}</div>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row type="flex" justify="center" class="small-gap">
                    <el-button
                      v-if="needModify"
                      plain
                      class="orange-text"
                      size="mini"
                      @click.native.prevent="confirmModify(item)"
                    >确定</el-button>
                    <el-button
                      v-else
                      plain
                      class="orange-text"
                      size="mini"
                      @click.native.prevent="modifyScore"
                    >修改成绩</el-button>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else>
          <el-collapse :accordion="true">
            <el-collapse-item
              v-for="(items,index) in personalScore"
              :key="index"
              @click.native="searchScore(items,items)"
            >
              <template slot="title">
                <div class="sub-title-text">{{'第'+items.round+'轮 '+items.roundScore}}</div>
              </template>
              <el-collapse :accordion="true">
                <div v-for="(item,ind) in items.score" :key="ind">
                  <el-row>
                    <div class="content-text text-center">{{item.seminarName}}</div>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <div class="tip-text text-center">展示:{{item.presentationScore}}</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="tip-text text-center">提问:{{item.questionScore}}</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="tip-text text-center">书面报告:{{item.reportScore}}</div>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div v-else class="content-text bold-text text-center">暂无数据</div>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-sub-header :role="role"></common-sub-header>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <common-aside :role="role" :courseID="courseID" :class="classID"></common-aside>
      </el-aside>
      <el-main class="main-gap">
        <!-- <title-card>{{modifiedTitle}}</title-card>
        <div v-if="role==='teacher'">
          <el-form class="normal-gap">
            <el-form-item>
              <template slot="label">
                <div class="content-text bold-text">讨论课轮次：</div>
              </template>
              <el-select
                v-model="round"
                placeholder="请选择轮次"
                class="content-text"
                size="medium"
                no-data-text="暂时没有轮次可选"
              >
                <el-option value="1" label="第一轮讨论课" class="content-text"></el-option>
                <el-option value="2" label="第二轮讨论课" class="content-text"></el-option>
                <el-option value="3" label="第三轮讨论课" class="content-text"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-card shadow="never" class="small-gap">
            <div slot="header">
              <span class="title-text">学生列表</span>
              <el-row class="content-text bold-text text-center small-gap">
                <el-col :span="4">小组总分</el-col>
                <el-col :span="4">参与讨论课</el-col>
                <el-col :span="4">发言成绩</el-col>
                <el-col :span="4">提问成绩</el-col>
                <el-col :span="4">报告成绩</el-col>
                <el-col :span="4">该次总成绩</el-col>
              </el-row>
            </div>
            <div style="height: 35vh">
              <el-scrollbar class="full-height">
                <el-table
                  :data="tableData"
                  :show-header="false"
                  :span-method="arraySpan"
                  row-class-name="content-text"
                >
                  <el-table-column align="center">
                    <template
                      slot-scope="scope"
                    >{{teamScore(scope.row.teamName, scope.row.roundScore)}}</template>
                  </el-table-column>
                  <el-table-column prop="seminarName" align="center"></el-table-column>
                  <el-table-column prop="presentationScore" align="center"></el-table-column>
                  <el-table-column prop="questionScore" align="center"></el-table-column>
                  <el-table-column prop="reportScore" align="center"></el-table-column>
                  <el-table-column prop="totalScore" align="center"></el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </el-card>
        </div>
        <div v-else>
          <el-card shadow="never" class="normal-gap">
            <div slot="header">
              <el-row class="content-text bold-text text-center">
                <el-col :span="4">轮数</el-col>
                <el-col :span="4">参与讨论课</el-col>
                <el-col :span="4">发言成绩</el-col>
                <el-col :span="4">提问成绩</el-col>
                <el-col :span="4">报告成绩</el-col>
                <el-col :span="4">总成绩</el-col>
              </el-row>
            </div>
            <div style="height: 50vh">
              <el-scrollbar class="full-height">
                <el-table :data="tableData" :show-header="false" row-class-name="content-text">
                  <el-table-column prop="round" align="center"></el-table-column>
                  <el-table-column prop="seminarName" align="center"></el-table-column>
                  <el-table-column prop="presentationScore" align="center"></el-table-column>
                  <el-table-column prop="questionScore" align="center"></el-table-column>
                  <el-table-column prop="reportScore" align="center"></el-table-column>
                  <el-table-column prop="roundScore" align="center"></el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </el-card>
        </div>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import CommonAside from '@/components/common/CommonAside'
import TitleCard from '@/components/common/TitleCard'

export default {
  name: 'ScorePage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      round: undefined,
      roundList: [],
      tableData: [],
      spanArr: undefined,
      messageVisible: false,
      needModify: false,
      roundMap: new Map(),
      teamMap: new Map()
    }
  },
  computed: {
    modifiedTitle() {
      return this.courseName + '-讨论课成绩'
    },
    teamScore() {
      return (name, score) => {
        return name + ': ' + score
      }
    },
    role() {
      return this.$store.state.role
    },
    isMobile() {
      return this.$store.state.isMobile
    },
    courseID() {
      return this.$route.query.courseID
    },
    courseName() {
      return this.$route.query.courseName
    },
    personalScore() {
      let scoreList = []
      let indexMap = new Map()
      this.tableData.forEach((value, index, array) => {
        let roundIndex = indexMap.get(value.round)
        if (roundIndex === undefined) {
          indexMap.set(value.round, scoreList.length)
          roundIndex = scoreList.length
          scoreList.push({
            roundID: value.roundID,
            round: value.round,
            roundScore: value.roundScore,
            teamID: value.teamID,
            teamName: value.teamName,
            score: []
          })
        }
        scoreList[roundIndex].score.push({
          seminarID: value.seminarID,
          seminarOrder: value.seminarOrder,
          seminarName: value.seminarName,
          presentationScore: value.presentationScore,
          questionScore: value.questionScore,
          reportScore: value.reportScore
        })
      })
      scoreList.sort((a, b) => a.round - b.round)
      scoreList.forEach((val, index, arr) => {
        scoreList[index].score.sort((a, b) => {
          if (a.seminarID === undefined)
            return 1
          if (b.seminarID === undefined)
            return -1
          return a.seminarOrder - b.seminarOrder
        })
      })
      return scoreList
    },
    totalScoreInfo() {
      let scoreList = []
      let roundIndexMap = new Map()
      let teamIndexMap = new Map()
      this.tableData.forEach((value, index, array) => {
        let roundIndex = roundIndexMap.get(value.round)
        if (roundIndex === undefined) {
          roundIndexMap.set(value.round, scoreList.length)
          roundIndex = scoreList.length
          scoreList.push({
            roundID: value.roundID,
            round: value.round,
            teamList: []
          })
        }
        if (value.teamID !== undefined) {
          let teamIndex = teamIndexMap.get(roundIndex + '-' + value.teamID)
          if (teamIndex === undefined) {
            teamIndexMap.set(roundIndex + '-' + value.teamID, scoreList[roundIndex].teamList.length)
            teamIndex = scoreList[roundIndex].teamList.length
            scoreList[roundIndex].teamList.push({
              teamID: value.teamID,
              teamName: value.teamName,
              roundScore: value.roundScore,
              score: []
            })
          }
          scoreList[roundIndex].teamList[teamIndex].score.push({
            seminarID: value.seminarID,
            seminarOrder: value.seminarOrder,
            seminarName: value.seminarName,
            presentationScore: value.presentationScore,
            questionScore: value.questionScore,
            reportScore: value.reportScore
          })
        }
      })
      scoreList.sort((a, b) => a.round - b.round)
      scoreList.forEach((val, index, array) => {
        scoreList[index].teamList.sort((a, b) => {
          let aArr = a.teamName.split('-')
          let bArr = b.teamName.split('-')
          let aTeam = parseInt(aArr[0]) * 100 + parseInt(aArr[1])
          let bTeam = parseInt(bArr[0]) * 100 + parseInt(bArr[1])
          return aTeam - bTeam
        })
        scoreList[index].teamList.forEach((v, i, arr) => {
          scoreList[index].teamList[i].score.sort((a, b) => {
            if (a.seminarID === undefined)
              return 1
            if (b.seminarID === undefined)
              return -1
            return a.seminarOrder - b.seminarOrder
          })
        })
      })
      return scoreList
    }
  },
  methods: {
    arraySpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    modifyScore() {
      this.needModify = true
    },
    confirmModify(round) {
      let teamID = round.teamID
      round.score.forEach((seminar, index, array) => {
        if (seminar.seminarID !== undefined) {
          this.$http.put('/seminar/' + seminar.seminarID + '/team/' + teamID + '/seminarscore', {
            presentationScore: seminar.presentationScore,
            questionScore: seminar.questionScore,
            reportScore: seminar.reportScore
          }).then(() => {
            if (index === round.score.length - 2) {
              this.$createToast({
                time: 500,
                txt: '修改成功',
                type: 'correct',
                onTimeout: () => {
                  this.needModify = false
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
        }
      })
    },
    searchTeam(item) {
      let roundIndex = this.roundMap.get(item.roundID)
      if (roundIndex !== undefined) {
        return
      }
      this.roundMap.set(item.roundID, item.roundID)
      this.$http.get('/round/' + item.roundID + '/roundscore').then(roundScoreList => {
        roundScoreList.forEach(roundScore => {
          this.tableData.push({
            roundID: item.roundID,
            round: item.round,
            teamID: roundScore.teamID,
            teamName: roundScore.teamName,
            roundScore: roundScore.totalScore,
            seminarID: undefined,
            seminarOrder: undefined,
            seminarName: '本轮次成绩',
            presentationScore: roundScore.preScore,
            questionScore: roundScore.questionScore,
            reportScore: roundScore.reportScore,
            totalScore: roundScore.totalScore
          })
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: 'error'
        }).show()
      })
    },
    searchScore(roundItem, teamItem) {
      let teamIndex = this.teamMap.get(roundItem.roundID + '-' + teamItem.teamID)
      if (teamIndex !== undefined) {
        return
      }
      this.teamMap.set(roundItem.roundID + '-' + teamItem.teamID, teamItem.teamID)
      this.$http.get('/round/' + roundItem.roundID + '/seminar').then(res => {
        res.forEach(seminar => {
          this.$http.get('/seminar/' + seminar.id + '/team/' + teamItem.teamID + '/seminarscore').then(score => {
            this.tableData.push({
              roundID: roundItem.roundID,
              round: roundItem.round,
              teamID: teamItem.teamID,
              teamName: teamItem.teamName,
              roundScore: roundItem.totalScore,
              seminarID: seminar.id,
              seminarOrder: seminar.order,
              seminarName: seminar.topic,
              presentationScore: score.presentationScore,
              questionScore: score.questionScore,
              reportScore: score.reportScore,
              totalScore: score.totalScore
            })
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: 'error'
            }).show()
          })
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: 'error'
        }).show()
      })
    }
  },
  created() {
    if (this.isMobile) {
      this.$http.get('/course/' + this.courseID + '/round').then(response => {
        this.roundList = response
        this.roundList.forEach(item => {
          if (this.role === 'teacher') {
            this.tableData.push({
              roundID: item.id,
              round: item.order,
              teamID: undefined,
              teamName: undefined,
              roundScore: undefined,
              seminarID: undefined,
              seminarOrder: undefined,
              seminarName: undefined,
              presentationScore: undefined,
              questionScore: undefined,
              reportScore: undefined,
              totalScore: undefined
            })
          }
          else {
            this.$http.get('/course/' + this.courseID + '/myTeam').then(team => {
              this.$http.get('/round/' + item.id + '/team/' + team.id + '/roundscore').then(roundScore => {
                this.tableData.push({
                  roundID: item.id,
                  round: item.order,
                  teamID: team.id,
                  teamName: team.klassSerial + '-' + team.teamSerial,
                  roundScore: roundScore.totalScore,
                  seminarID: undefined,
                  seminarOrder: undefined,
                  seminarName: '本轮次成绩',
                  presentationScore: roundScore.preScore,
                  questionScore: roundScore.questionScore,
                  reportScore: roundScore.reportScore,
                  totalScore: roundScore.totalScore
                })
              }).catch(error => {
                this.$createToast({
                  time: 500,
                  txt: error.message,
                  type: 'error'
                }).show()
              })
            })
          }
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: 'error'
          }).show()
        })
      })
    } else {
      if (this.role === 'teacher') {
        this.spanArr = []
        let curIndex = 0
        this.tableData.forEach((value, index, arr) => {
          if (index === 0) {
            this.spanArr.push(1)
          } else {
            if (arr[index - 1].teamName === value.teamName) {
              this.spanArr[curIndex]++
              this.spanArr.push(0)
            }
            else {
              this.spanArr.push(1)
              curIndex = index
            }
          }
        })
      }
    }
  }
}
</script>
