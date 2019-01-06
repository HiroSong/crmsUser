<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="student" :is-mobile="true">创建小组</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-validator :model="teamName" :rules="{ required: true}" v-model="teamNameValid">
        <cube-input v-model="teamName" placeholder="请输入小组名" :clearable="true" class="content-text"></cube-input>
      </cube-validator>
      <cube-validator :model="selectedClass" :rules="{ required: true}" v-model="classValid">
        <cube-select
          class="small-gap"
          v-model="selectedClass"
          :options="classOptions"
          placeholder="请选择班级"
        ></cube-select>
      </cube-validator>
      <el-row>
        <div class="content-text small-gap">添加成员</div>
      </el-row>
      <div style="height: 40vh;" class="small-gap">
        <el-scrollbar class="full-height">
          <cube-checkbox-group v-model="memberList" :options="ungroupedList" class="tip-text"></cube-checkbox-group>
        </el-scrollbar>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createTeam"
          >创建</el-button>
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
      teamName: undefined,
      selectedClass: undefined,
      classOptions: [],
      ungroupedList: [],
      memberList: [],
      teamNameValid: true,
      classValid: true,
      teamSerial: 0
    }
  },
  computed: {
    id() {
      return this.$store.state.id
    },
    courseID() {
      return this.$route.query.courseID
    },
    members() {
      let mem = []
      this.memberList.forEach(item => mem.push({ id: item }))
      return mem
    },
    classSerial() {
      let serial = "1"
      this.classOptions.forEach(item => {
        if (item.value === this.selectedClass) {
          serial = item.text.split('(')[1].split(')')[0]
        }
      })
      return parseInt(serial)
    }
  },
  methods: {
    createTeam() {
      if (!(this.teamNameValid && this.classValid)) {
        return
      }
      this.$http.get('/course/' + this.courseID + '/team').then(teams => {
        let classTeam = []
        teams.forEach(item => {
          if (this.classSerial === item.klassSerial) {
            classTeam.push(item)
          }
        })
        this.teamSerial = classTeam.length + 1
        this.$http.post('/course/' + this.courseID + '/team', {
          teamName: this.teamName,
          teamSerial: this.teamSerial,
          course: {
            id: parseInt(this.courseID)
          },
          klass: {
            id: parseInt(this.selectedClass),
            klassSerial: this.classSerial
          },
          leader: {
            id: parseInt(this.id)
          },
          members: this.members
        }).then(response =>
          this.$createToast({
            time: 500,
            txt: '创建成功',
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
    this.$http.get('/course/' + this.courseID + '/noTeam').then(response =>
      response.forEach(element => {
        if (element.id != this.$store.state.id) {
          this.ungroupedList.push({
            label: element.account + '-' + element.name,
            value: element.id
          })
        }
      })
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/course/' + this.courseID + '/class').then(response =>
      response.forEach(element => {
        this.classOptions.push({
          text: element.name,
          value: element.id
        })
      })
    ).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
  }
}
</script>
