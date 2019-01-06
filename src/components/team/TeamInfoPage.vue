<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="student" :is-mobile="true">{{courseName+' '+className}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-row type="flex" justify="end">
        <el-col :span="16">
          <div
            class="content-text bold-text text-center"
          >{{myTeam.klassSerial+'-'+myTeam.teamSerial+' '+myTeam.name}}</div>
        </el-col>
        <el-col :span="4">
          <div v-if="isInvalid" class="red-text text-center" style="font-size: 0.75rem;">invalid</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around" class="small-gap">
        <el-col :span="4">
          <div class="tip-text bold-text">组长：</div>
        </el-col>
        <el-col :span="12">
          <div
            v-if="isLeader"
            class="green-text"
            style="font-size: 0.75rem;"
          >{{myTeam.leader.account}}</div>
          <div v-else class="tip-text">{{myTeam.leader.account}}</div>
        </el-col>
        <el-col :span="8">
          <div v-if="isLeader" class="green-text" style="font-size: 0.75rem;">{{myTeam.leader.name}}</div>
          <div v-else class="tip-text">{{myTeam.leader.name}}</div>
        </el-col>
      </el-row>
      <div v-for="(member,ind) in myTeam.members" :key="ind">
        <el-row type="flex" justify="space-around" class="small-gap">
          <el-col :span="4">
            <div v-if="ind===0" class="tip-text bold-text">组员：</div>
          </el-col>
          <el-col :span="12">
            <div
              v-if="member.id == $store.state.id"
              class="green-text"
              style="font-size: 0.75rem;"
            >{{member.account}}</div>
            <div v-else class="tip-text">{{member.account}}</div>
          </el-col>
          <el-col :span="8">
            <div v-if="isLeader">
              <div class="tip-text">
                {{member.name}}
                <div
                  type="text"
                  plain
                  class="el-icon-error red-text"
                  style="max-height: 0.75rem;max-width: 0.75rem;"
                  @click="deleteMember(member.id)"
                ></div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="member.id == $store.state.id"
                class="green-text"
                style="font-size: 0.75rem;"
              >{{member.name}}</div>
              <div v-else class="tip-text">{{member.name}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="isMainCourse">
        <div v-if="isLeader">
          <el-row>
            <div class="tip-text bold-text small-gap">添加成员</div>
          </el-row>
          <div style="height: 35vh" class="small-gap">
            <el-scrollbar class="full-height">
              <cube-checkbox-group
                v-model="newMemberList"
                :options="sortedNoTeamList"
                class="tip-text"
              >
                <cube-checkbox
                  v-for="(item,index) in sortedNoTeamList"
                  :key="index"
                  :option="{value: item.id, label: item.account+' '+item.name}"
                ></cube-checkbox>
              </cube-checkbox-group>
            </el-scrollbar>
          </div>
          <el-row type="flex" justify="space-between">
            <el-button
              type="danger"
              plain
              class="normal-gap"
              size="mini"
              @click.native.prevent="dismissTeam"
            >解散</el-button>
            <el-button
              v-if="isInvalid"
              plain
              class="orange-text normal-gap"
              size="mini"
              @click.native.prevent="sendApplication"
            >发送申请</el-button>
            <el-button
              plain
              class="orange-text normal-gap"
              size="mini"
              @click.native.prevent="addMember"
            >添加</el-button>
          </el-row>
        </div>
        <el-row v-else type="flex" justify="end">
          <el-button
            type="danger"
            plain
            class="normal-gap"
            size="mini"
            @click.native.prevent="leaveTeam"
          >退出</el-button>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TeamInfoPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      noTeamList: [],
      newMemberList: [],
      myTeam: undefined,
      courseName: undefined,
      className: undefined,
      isMainCourse: true
    }
  },
  computed: {
    id() {
      return this.$store.state.id
    },
    sortedNoTeamList() {
      return this.noTeamList.sort((a, b) => {
        return parseInt(a.account) - parseInt(b.account)
      })
    },
    courseID() {
      return this.$route.query.courseID
    },
    classID() {
      return this.$route.query.classID
    },
    isInvalid() {
      return this.myTeam.valid === 0
    },
    isLeader() {
      return this.$store.state.id == this.myTeam.leader.id
    }
  },
  methods: {
    dismissTeam() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定解散队伍吗？',
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
          this.$http.delete('/team/' + this.myTeam.id).then(() =>
            this.$createToast({
              time: 500,
              txt: '解散成功',
              type: 'correct',
              onTimeout: () => {
                this.$router.back()
              }
            }).show()
          ).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
      }).show()
    },
    addMember() {
      let success = true
      this.newMemberList.forEach(item => {
        this.$http.put('/team/' + this.myTeam.id + '/member/new', { id: item }).then().catch(error => {
          success = false
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      })
      if (success) {
        this.$createToast({
          time: 500,
          txt: '成员添加成功！',
          type: 'correct',
          onTimeout: () => {
            this.newMemberList = []
            this.updateList()
          }
        }).show()
      }
    },
    leaveTeam() {
      this.$createDialog({
        type: 'confirm',
        title: '警告',
        content: '确定退出当前队伍吗？',
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
          this.$http.put('/team/' + this.myTeam.id + '/member/old', { id: this.id }).then(() => {
            this.$createToast({
              time: 500,
              txt: '退出成功',
              type: 'correct',
              onTimeout: () => {
                this.$router.back()
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
    deleteMember(memberID) {
      this.$createDialog({
        type: 'confirm',
        title: '警告',
        content: '确定删除该成员吗？',
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
          this.$http.put('/team/' + this.myTeam.id + '/member/old', { id: memberID }).then(() => {
            this.$createToast({
              time: 500,
              txt: '删除成功',
              type: 'correct',
              onTimeout: () => {
                this.updateList()
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
    sendApplication() {
      this.$createDialog({
        type: 'prompt',
        title: '申请理由',
        prompt: {
          placeholder: '请输入理由'
        },
        onConfirm: (e, promptValue) => {
          this.$http.get('/course/' + this.courseID).then(response => {
            let teacherID = response.teacherID
            this.$http.post('/team/' + this.myTeam.id + '/teamvalidrequest', { teacher: { id: teacherID }, reason: promptValue }).then(() => {
              this.$createToast({
                type: 'correct',
                time: 500,
                txt: '发送成功'
              }).show()
            })
          })
        }
      }).show()
    },
    updateList() {
      this.$http.get('/course/' + this.courseID + '/myTeam').then(response =>
        this.myTeam = response
      ).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
      this.$http.get('/course/' + this.courseID + '/noTeam').then(response => {
        this.noTeamList = []
        response.forEach(element => {
          this.noTeamList.push(element)
        })
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
    this.updateList()
    this.$http.get('/course/' + this.courseID).then(response => {
      this.courseName = response.name
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/class/' + this.classID).then(response => this.className = response.grade + ' (' + response.klassSerial + ')'
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/course/' + this.courseID + '/teamshare').then(response => {
      response.forEach(item => {
        if (!item.isMainCourse) {
          this.isMainCourse = false
        }
      })
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
