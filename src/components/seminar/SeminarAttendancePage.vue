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
            <div v-if="scope.row.teamSerial===undefined">
              <div
                class="el-icon-circle-plus-outline green-text"
                style="font-size:0.875rem;"
              >&nbsp;报名</div>
            </div>
            <div v-else>
              <div
                v-if="scope.row.pptUrl===undefined"
                class="red-text"
                style="font-size:0.875rem;"
              >{{scope.row.teamSerial+' 未提交'}}</div>
              <div v-else class="context-text">{{scope.row.teamSerial+' '+scope.row.pptName}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarMainPage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      teamLimit: 6,
      courseName: 'OOAD',
      seminarStatus: '未开始',
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

  }
}
</script>
