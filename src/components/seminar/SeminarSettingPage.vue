<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">{{'第'+roundInfo.order+'轮'}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div class="content-text">讨论课</div>
      <el-row>
        <el-col :offset="4" :span="20">
          <div
            class="content-text small-gap"
            v-for="(item,index) in seminarList"
            :key="index"
          >{{item}}</div>
        </el-col>
      </el-row>
      <div class="content-text normal-gap">成绩设置</div>
      <cube-form :model="roundInfo" :schema="schemaScore" class="content-text"></cube-form>
      <div class="content-text normal-gap">本轮讨论课报名次数</div>
      <div v-for="(item,index) in roundInfo.signUpNumber" :key="index">
        <cube-form
          :model="roundInfo.signUpNumber[index]"
          :schema="schemaAttendance(item)"
          class="content-text"
        ></cube-form>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="modifySeminar"
          >修改</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TodoPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      options: [{
        value: 0,
        text: '最高分'
      }, {
        value: 1,
        text: '平均分'
      }],
      roundInfo: undefined,
      seminarList: []
    }
  },
  computed: {
    roundID() {
      return this.$route.query.roundID
    },
    schemaScore() {
      return {
        fields: [{
          type: 'select',
          modelKey: 'calculatePreType',
          label: '课堂展示',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'calculateQueType',
          label: '课堂提问',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'calculateRepType',
          label: '课堂报告',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }]
      }
    },
    ruleOptions() {
      let optionsList = []
      this.seminarList.forEach((value, index, array) => {
        optionsList.push(index + 1)
      })
      return optionsList
    },
    schemaAttendance() {
      return item => {
        return {
          fields: [{
            type: 'select',
            modelKey: 'signUpNumber',
            label: item.klassGrade + '(' + item.klassSerial + ')',
            props: {
              options: this.ruleOptions
            },
            rules: {
              required: true
            }
          }]
        }
      }
    }
  },
  methods: {
    modifySeminar() {
      this.$http.put('/round/' + this.roundID, {
        roundSerial: this.roundInfo.order,
        presentationScoreMethod: this.roundInfo.calculatePreType,
        questionScoreMethod: this.roundInfo.calculateQueType,
        reportScoreMethod: this.roundInfo.calculateRepType,
        signUpNumber: this.roundInfo.signUpNumber
      }).then(() => {
        this.$createToast({
          time: 500,
          txt: '修改成功',
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
  },
  created() {
    this.$http.get('/round/' + this.roundID).then(response => {
      this.roundInfo = response
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    this.$http.get('/round/' + this.roundID + '/seminar').then(response => {
      response.forEach(item => {
        this.seminarList.push(item.topic)
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
