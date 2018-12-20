<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">{{courseName+'-书面报告'}}</common-sub-header>
    </el-header>
    <el-main>
      <el-table :data="attendenceList" :show-header="false">
        <el-table-column min-width="40%" align="left">
          <template slot-scope="scope">
            <div class="content-text">{{'第'+scope.row.order+'组'}}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="60%" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.teamSerial!==undefined">
              <el-row>
                <div
                  v-if="scope.row.reportUrl===undefined"
                  class="red-text"
                  style="font-size:0.875rem;"
                >{{scope.row.teamSerial+' 未提交'}}</div>
                <a
                  v-else
                  class="green-text"
                  style="font-size:0.875rem;"
                  :href="scope.row.reportUrl"
                  :download="scope.row.reportName"
                >{{scope.row.teamSerial+' '+scope.row.reportName}}</a>
              </el-row>
              <el-row>
                <cube-rate :justify="true" v-model="scope.row.reportScore"></cube-rate>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="normal-gap" type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="orange-text full-width"
            @click.native.prevent="downloadReport"
          >批量下载</el-button>
        </el-col>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
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
      teamLimit: 6,
      courseName: 'OOAD',
      attendenceList: [{
        order: 1,
        teamSerial: '1-1',
        reportName: undefined,
        reportUrl: undefined,
        reportScore: undefined
      }, {
        order: 2,
        teamSerial: '1-2',
        reportName: '业务流程.pdf',
        reportUrl: '/1234.pdf',
        reportScore: undefined
      }, {
        order: 3,
        teamSerial: undefined,
        reportName: undefined,
        reportUrl: undefined,
        reportScore: undefined
      }]
    }
  },
  methods: {
    downloadReport() {

    },
    submitScore() {
      this.$createToast({
        time: 500,
        txt: '成绩提交成功！',
        type: 'correct'
      }).show()
    }
  }
}
</script>
