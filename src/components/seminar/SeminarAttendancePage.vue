<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName+'-讨论课'}}</common-sub-header>
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
            <div v-if="scope.row.teamSerial===undefined&&seminarStatus==='未开始'">
              <div
                class="el-icon-circle-plus-outline green-text"
                style="font-size:0.875rem;"
                @click="regiestSeminar"
              >&nbsp;报名</div>
            </div>
            <div v-else-if="seminarStatus==='未开始'">
              <div
                v-if="scope.row.pptUrl===undefined"
                class="red-text"
                style="font-size:0.875rem;"
              >{{scope.row.teamSerial+' 未提交'}}</div>
              <div v-else class="context-text">{{scope.row.teamSerial+' '+scope.row.pptName}}</div>
            </div>
            <div v-else-if="seminarStatus==='正在进行'||seminarStatus==='暂停计时'">
              <div
                v-if="scope.row.pptUrl===undefined"
                class="red-text"
                style="font-size:0.875rem;"
              >{{scope.row.teamSerial+' 未提交'}}</div>
              <a
                v-else
                class="green-text"
                style="font-size:0.875rem;"
                :href="scope.row.pptUrl"
                :download="scope.row.pptName"
              >{{scope.row.teamSerial+' '+scope.row.pptName}}</a>
            </div>
            <div v-else>
              <div class="conent-text">{{scope.row.teamSerial}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        v-show="hasAttendance&&seminarStatus==='未开始'"
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
      <el-row v-if="role==='teacher'" class="normal-gap" type="flex" justify="center">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="downloadPPT">批量下载</el-button>
        </el-col>
      </el-row>
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
      teamLimit: 6,
      courseName: 'OOAD',
      seminarStatus: '未开始',
      hasAttendance: true,
      attendenceList: [{
        order: 1,
        teamSerial: '1-1',
        pptName: undefined,
        pptUrl: undefined
      }, {
        order: 2,
        teamSerial: '1-2',
        pptName: '业务流程.pptx',
        pptUrl: '/1234.pptx'
      }, {
        order: 3,
        teamSerial: undefined,
        pptName: undefined,
        pptUrl: undefined
      }]
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    regiestSeminar() {
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
          // ajax取消共享
          this.hasAttendance = true
          this.$createToast({
            time: 500,
            txt: '报名成功!',
            type: 'correct'
          }).show()
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
          this.hasAttendance = false
          // ajax取消共享
          this.$createToast({
            time: 500,
            txt: '取消成功！',
            type: 'correct'
          }).show()
        }
      }).show()
    },
    downloadPPT() {

    }
  }
}
</script>
