<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">组队</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div v-if="role!=='teacher'&&myTeam!==undefined" @click="enterTeamInfo" style="height: 5vh;">
        <el-row>
          <el-col :span="16" :offset="4">
            <div
              class="iconfont icon-xuesheng orange-text full-width text-center more-text"
              style="font-size: 0.75rem;"
            >{{' '+myTeam.klassSerial+'-'+myTeam.teamSerial+' '+myTeam.name+'(我的小组)'}}</div>
          </el-col>
          <el-col :span="4" v-if="isInvalid">
            <div class="red-text text-center" style="font-size: 0.75rem;">invalid</div>
          </el-col>
        </el-row>
      </div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item,index) in sortedTeamList" :key="index">
          <template slot="title">
            <div
              class="iconfont icon-xiaozu content-text more-text"
            >{{' '+item.klassSerial+'-'+item.teamSerial+' '+item.name}}</div>
          </template>
          <el-row type="flex" justify="space-around">
            <el-col :span="4">
              <div class="tip-text bold-text">组长：</div>
            </el-col>
            <el-col :span="12">
              <div class="tip-text">{{item.leader.account}}</div>
            </el-col>
            <el-col :span="8">
              <div class="tip-text">{{item.leader.name}}</div>
            </el-col>
          </el-row>
          <div v-for="(member,ind) in item.members" :key="ind">
            <el-row type="flex" justify="space-around">
              <el-col :span="4">
                <div v-if="ind===0" class="tip-text bold-text">组员：</div>
              </el-col>
              <el-col :span="12">
                <div class="tip-text">{{member.account}}</div>
              </el-col>
              <el-col :span="8">
                <div class="tip-text">{{member.name}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <div class="iconfont icon-danren content-text">&nbsp;未组队学生</div>
          </template>
          <div style="height: 35vh" class="small-gap">
            <el-scrollbar class="full-height">
              <el-row v-for="(item,index) in sortedNoTeamList" :key="index">
                <el-col :span="12">
                  <div class="tip-text">{{item.account}}</div>
                </el-col>
                <el-col :span="12">
                  <div class="tip-text">{{item.name}}</div>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-row type="flex" justify="center" v-if="role!=='teacher'&&myTeam===undefined&&!isExpired">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createTeam"
          >创建小组</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TeamPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      isExpired: undefined,
      myTeam: undefined,
      teamList: [],
      noTeamList: []
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    courseID() {
      return this.$route.query.courseID
    },
    isInvalid() {
      return this.myTeam.valid === 0
    },
    sortedTeamList() {
      return this.teamList.sort((a, b) => {
        return a.klassSerial * 100 + a.teamSerial - b.klassSerial * 100 - b.teamSerial
      })
    },
    sortedNoTeamList() {
      return this.noTeamList.sort((a, b) => {
        return parseInt(a.account) - parseInt(b.account)
      })
    }
  },
  methods: {
    enterTeamInfo() {
      this.$router.push({ path: '/team/info', query: { teamID: this.myTeam.id, courseID: this.courseID, classID: this.$route.query.classID } })
    },
    createTeam() {
      this.$router.push({ path: '/team/create', query: { courseID: this.courseID } })
    }
  },
  created() {
    if (this.role !== 'teacher') {
      this.$http.get('/course/' + this.courseID + '/myTeam').then(response => {
        if (response.id !== undefined) {
          this.myTeam = response
        } else {
          this.myTeam = undefined
        }
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
    this.$http.get('/course/' + this.courseID + '/team').then(response =>
      response.forEach(element => {
        if (!(this.myTeam !== undefined && element.id === this.myTeam.id)) {
          this.teamList.push(element)
        }
      })
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/course/' + this.courseID + '/noTeam').then(response =>
      response.forEach(element => {
        this.noTeamList.push(element)
      })
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/course/' + this.courseID).then(response => {
      this.isExpired = (new Date()).getTime() > this.$datetimeFormat.toDate(response.endTeamTime).getTime()
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
