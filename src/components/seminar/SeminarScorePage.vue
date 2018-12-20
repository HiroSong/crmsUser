<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName+'-成绩'}}</common-sub-header>
    </el-header>
    <el-main>
      <div v-if="role==='teacher'">
        <div v-show="canModify">
          <el-table
            :data="scoreData"
            header-row-class-name="tip-text bold-text"
            row-class-name="tip-text"
          >
            <el-table-column min-width="20%" prop="teamSerial" align="left"></el-table-column>
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
          <el-table :data="scoreData" row-class-name="tip-text" :show-header="false">
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
      courseName: 'OOAD',
      seminarInfo: {
        round: 1,
        id: undefined,
        topic: '需求分析',
        intro: undefined,
        status: '已完成',
        order: 1,
        courseId: undefined,
        classId: undefined
      },
      attendanceData: {
        teamGrade: '2016',
        teamOrder: '1',
        attendanceOrder: 1,
        presentationScore: 5,
        reportScore: 5,
        questionScore: 5,
        sumScore: 5
      },
      scoreData: [{
        teamSerial: '1-1',
        presentationScore: 5,
        questionScore: 5,
        reportScore: 5,
        sumScore: 5
      }],
      canModify: true
    }
  },
  computed: {
    role() {
      return this.$store.state.role
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
        content: this.attendanceData.teamGrade + '-(' + this.attendanceData.teamOrder + ') ' + this.attendanceData.attendanceOrder
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

      this.canModify = true
      this.$createToast({
        time: 500,
        txt: '修改成功!',
        type: 'correct'
      }).show()
    },
    modifyScore() {

      this.canModify = false
    }
  }
}
</script>
