<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-sub-header role="teacher" :is-mobile="true">新建讨论课</common-sub-header>
      </el-header>
      <el-main class="main-gap">
        <cube-validator :model="seminarInfo.topic" :rules="{required: true}" v-model="topicValid">
          <cube-input
            v-model="seminarInfo.topic"
            placeholder="主题"
            type="text"
            :clearable="true"
            :autofocus="true"
            class="content-text"
          ></cube-input>
        </cube-validator>
        <cube-textarea
          v-model="seminarInfo.intro"
          placeholder="讨论课主要内容、要求、具体讨论部分..."
          class="content-text"
        ></cube-textarea>
        <el-row class="small-gap">
          <el-col :span="12">
            <div class="content-text">讨论课可见</div>
          </el-col>
          <el-col :span="6">
            <el-switch
              v-model="seminarInfo.beVisible"
              active-color="#fc9153"
              @change="setVisibleStatus"
            ></el-switch>
          </el-col>
          <el-col :span="6">
            <div class="content-text">{{visibleStatus}}</div>
          </el-col>
        </el-row>
        <cube-form :model="seminarInfo" :schema="schemaSeminar" class="content-text small-gap"></cube-form>
        <el-row>
          <div class="small-gap content-text">展示报名开始时间</div>
        </el-row>
        <cube-input
          v-model="seminarInfo.signUpStartTime"
          placeholder="报名开始时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showSignUpStartTimePicker"
        ></cube-input>
        <el-row>
          <div class="small-gap content-text">展示报名截止时间</div>
        </el-row>
        <cube-input
          v-model="seminarInfo.signUpEndTime"
          placeholder="报名截止时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showSignUpEndTimePicker"
        ></cube-input>
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="createSeminar">发布</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'CreateSeminarPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      seminarInfo: {
        topic: undefined,
        intro: undefined,
        order: undefined,
        beVisible: true,
        signUpStartTime: this.$datetimeFormat.getToday(),
        signUpEndTime: this.$datetimeFormat.getToday(),
        teamNumLimit: 5,
        round: undefined,
        visibleStatus: '可见'
      },
      orderOptions: [],
      roundOptions: [],
      topicValid: true
    }
  },
  computed: {
    courseID() {
      return this.$route.query.courseID
    },
    visibleStatus() {
      return this.seminarInfo.visibleStatus
    },
    schemaSeminar() {
      return {
        fields: [{
          type: 'input',
          modelKey: 'order',
          label: '讨论课次序号',
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'round',
          label: '所属轮次',
          props: {
            options: this.roundOptions,
            placeholder: '无(默认新建)'
          }
        }, {
          type: 'input',
          modelKey: 'teamNumLimit',
          label: '报名小组数',
          props: {
            type: 'number',
            placeholder: '请输入报名组数'
          },
          rules: {
            required: true
          }
        }]
      }
    }
  },
  methods: {
    showSignUpStartTimePicker() {
      this.$createDatePicker({
        title: '开始时间',
        min: new Date(),
        max: new Date(2020, 9, 20, 20, 59, 59),
        value: new Date(),
        columnCount: 6,
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'dd',
          hour: 'hh',
          minute: 'mm',
          second: 'ss'
        },
        onSelect: (date, selectedVal, selectedText) => {
          this.seminarInfo.signUpStartTime = this.$datetimeFormat.format(selectedText)
        }
      }).show()
    },
    showSignUpEndTimePicker() {
      if (this.seminarInfo.signUpStartTime === undefined) {
        this.$createToast({
          time: 500,
          txt: '请先选择开始时间',
          type: 'warn'
        }).show()
      } else {
        this.$createDatePicker({
          title: '结束时间',
          min: this.$datetimeFormat.toDate(this.seminarInfo.signUpStartTime),
          max: new Date(2020, 9, 20, 23, 59, 59),
          value: this.$datetimeFormat.toDate(this.seminarInfo.signUpStartTime),
          columnCount: 6,
          format: {
            year: 'YYYY',
            month: 'MM',
            date: 'dd',
            hour: 'hh',
            minute: 'mm',
            second: 'ss'
          },
          onSelect: (date, selectedVal, selectedText) => {
            this.seminarInfo.signUpEndTime = this.$datetimeFormat.format(selectedText)
          }
        }).show()
      }
    },
    setVisibleStatus() {
      this.seminarInfo.visibleStatus = this.seminarInfo.beVisible ? '可见' : '不可见'
    },
    createSeminar() {
      if (!this.topicValid || this.seminarInfo.order === undefined || this.seminarInfo.teamNumLimit === undefined) {
        return
      }
      this.$http.post('/course/' + this.courseID + '/seminar', {
        seminarName: this.seminarInfo.topic,
        introduction: this.seminarInfo.intro ? ' ' : this.seminarInfo.intro,
        maxTeam: this.seminarInfo.teamNumLimit,
        beVisible: this.seminarInfo.beVisible ? 1 : 0,
        seminarSerial: this.seminarInfo.order,
        roundOrder: this.seminarInfo.round === undefined ? this.roundOptions.length : (this.seminarInfo.round === 'new' ? this.roundOptions.length : undefined),
        round: (this.seminarInfo.round === undefined || this.seminarInfo.round === 'new') ? undefined : { id: this.seminarInfo.round },
        enrollStartTime: this.seminarInfo.signUpStartTime,
        enrollEndTime: this.seminarInfo.signUpEndTime
      }).then(() => {
        this.$createToast({
          time: 500,
          txt: '发布成功',
          type: 'correct',
          onTimeout: () => {
            this.$router.back()
          }
        }).show()
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
    this.$http.get('/course/' + this.courseID + '/round').then(response => {
      response.forEach(element => {
        this.roundOptions.push({
          text: element.order,
          value: element.id
        })
      })
      this.roundOptions.push({
        text: (response.length + 1) + '(新增)',
        value: 'new'
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
