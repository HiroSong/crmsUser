<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header v-if="role==='teacher'" :role="role" :is-mobile="true">学生成绩</common-sub-header>
      <common-sub-header v-else :role="role" :is-mobile="true">{{scoreTitle}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div v-if="role==='teacher'">
        <el-collapse :accordion="true">
          <el-collapse-item v-for="(items,index) in totalScore" :key="index">
            <template slot="title">
              <div class="sub-title-text">{{'第'+items.round+'轮'}}</div>
            </template>
            <el-collapse :accordion="true">
              <el-collapse-item v-for="(item,ind) in items.teamList" :key="ind">
                <template slot="title">
                  <div class="content-text">{{item.teamName+' ('+item.roundScore+')'}}</div>
                </template>
                <div v-for="(seminar, seminarInd) in item.score" :key="seminarInd">
                  <el-row>
                    <div class="content-text text-center">{{seminar.seminarName}}</div>
                  </el-row>
                  <div v-if="needModify">
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
                    @click.native.prevent="confirmModify"
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
          <el-collapse-item v-for="(items,index) in personalScore" :key="index">
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
      <el-row type="flex" justify="center" class="normal-gap">
        <el-button plain class="orange-text" @click.native.prevent="exportFile">导出excel</el-button>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-sub-header :role="role"></common-sub-header>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <common-aside :role="role"></common-aside>
      </el-aside>
      <el-main class="main-gap">
        <title-card>{{modifiedTitle}}</title-card>
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
                  <el-table-column prop="sumScore" align="center"></el-table-column>
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
        </div>
        <el-row type="flex" justify="end" class="small-gap">
          <el-button type="primary" @click.native.prevent="exportFile">导出excel</el-button>
        </el-row>
        <el-dialog title="提示" :visible.sync="messageVisible" width="30vw" class="content-text">
          <span>导出成功！</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" plain @click.native.prevent="messageVisible = false">确定</el-button>
          </span>
        </el-dialog>
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
      tableData: [{
        round: 1,
        teamName: '1-1',
        roundScore: '5分',
        seminarName: '第一次讨论课',
        presentationScore: 5,
        questionScore: 5,
        reportScore: 5,
        sumScore: 5
      }],
      courseName: undefined,
      className: undefined,
      spanArr: undefined,
      messageVisible: false,
      needModify: false
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
    scoreTitle() {
      return this.courseName + ' ' + this.className
    },
    personalScore() {
      let scoreList = []
      this.tableData.forEach((value, index, array) => {
        let roundIndex = -1
        scoreList.forEach((val, ind, arr) => {
          if (value.round === val.round) {
            roundIndex = ind
          }
        })
        if (roundIndex !== -1) {
          scoreList[roundIndex].score.push({
            seminarName: value.seminarName,
            presentationScore: value.presentationScore,
            questionScore: value.questionScore,
            reportScore: value.reportScore
          })
        } else {
          scoreList.push({
            round: value.round,
            roundScore: value.roundScore,
            score: [{
              seminarName: value.seminarName,
              presentationScore: value.presentationScore,
              questionScore: value.questionScore,
              reportScore: value.reportScore
            }]
          })
        }
      })
      return scoreList
    },
    totalScore() {
      let scoreList = []
      this.tableData.forEach((value, index, array) => {
        let roundIndex = -1
        scoreList.forEach((val, ind, arr) => {
          if (value.round === val.round) {
            roundIndex = ind
          }
        })
        if (roundIndex !== -1) {
          let teamIndex = -1
          scoreList[roundIndex].teamList.forEach((val, ind, arr) => {
            if (value.teamName === val.teamName) {
              teamIndex = ind
            }
          })
          if (teamIndex !== -1) {
            scoreList[roundIndex].teamList[teamIndex].score.push({
              seminarName: value.seminarName,
              presentationScore: value.presentationScore,
              questionScore: value.questionScore,
              reportScore: value.reportScore
            })
          } else {
            scoreList[roundIndex].teamList.push({
              teamName: value.teamName,
              roundScore: value.roundScore,
              score: [{
                seminarName: value.seminarName,
                presentationScore: value.presentationScore,
                questionScore: value.questionScore,
                reportScore: value.reportScore
              }]
            })
          }
        } else {
          scoreList.push({
            round: value.round,
            teamList: [{
              teamName: value.teamName,
              roundScore: value.roundScore,
              score: [{
                seminarName: value.seminarName,
                presentationScore: value.presentationScore,
                questionScore: value.questionScore,
                reportScore: value.reportScore
              }]
            }]
          })
        }
      })
      return scoreList
    }
  },
  created() {
    // 获取tableData
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
  },
  activated() {
    this.spanArr = []
    let curIndex = 0
    this.tableData.forEach((index, value, array) => {
      if (index === 0) {
        this.spanArr.push(1)
      } else {
        if (array[index - 1].teamName === value.teamName) {
          this.spanArr[curIndex]++
          this.spanArr.push(0)
        }
        else {
          this.spanArr.push(1)
          curIndex = index
        }
      }
    })
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
    confirmModify() {
      this.$createToast({
        time: 500,
        txt: '修改成功',
        type: 'correct'
      }).show()
      this.needModify = false
    },
    exportFile() {
      //ajax请求
      this.messageVisible = true
    }
  }
}
</script>
