<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-sub-header role="teacher" :is-mobile="true">修改讨论课</common-sub-header>
      </el-header>
      <el-main class="main-gap">
        <cube-input
          v-model="seminarInfo.topic"
          placeholder="主题"
          type="text"
          :clearable="true"
          :autofocus="true"
          class="content-text"
        ></cube-input>
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
          class="content-text"
          @click.native="showStartTimePicker"
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
          class="content-text"
          @click.native="showEndTimePicker"
        ></cube-input>
        <el-row>
          <div class="small-gap content-text">书面报告提交截止时间</div>
        </el-row>
        <div v-for="(item,index) in classList" :key="index">
          <el-row>
            <div class="small-gap content-text">{{item.name}}</div>
          </el-row>
          <cube-input
            v-model="classList[index].reportEndTime"
            placeholder="报告截止时间"
            type="datetime-local"
            :readonly="true"
            :disabled="true"
            class="content-text"
            @click.native="showReportEndTimePicker(index)"
          ></cube-input>
        </div>
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="modifySeminar">保存</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="small-gap">
          <el-col :span="12">
            <el-button
              type="danger"
              plain
              class="full-width"
              @click.native.prevent="deleteSeminar"
            >删除该讨论课</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'ModifySeminarPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      seminarInfo: undefined,
      classList: [],
      roundOptions: []
    }
  },
  computed: {
    seminarID() {
      return this.$route.query.seminarID
    },
    courseID() {
      return this.$route.query.courseID
    },
    visibleStatus() {
      return this.seminarInfo.beVisible ? '可见' : '不可见'
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
          },
          rules: {
            required: true
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
    showStartTimePicker() {
      this.$createDatePicker({
        title: '开始时间',
        min: new Date(),
        max: new Date(2020, 9, 20, 23, 59, 59),
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
    showEndTimePicker() {
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
      this.seminarInfo.visibleStatus = this.seminarInfo.isVisible ? '可见' : '不可见'
    },
    showReportEndTimePicker(index) {
      if (this.seminarInfo.signUpEndTime === undefined) {
        this.$createToast({
          time: 500,
          txt: '请先选择报名截止时间',
          type: 'warn'
        }).show()
      } else {
        this.$createDatePicker({
          title: '截止时间',
          min: this.$datetimeFormat.toDate(this.seminarInfo.signUpEndTime),
          max: new Date(2020, 9, 20, 23, 59, 59),
          value: this.$datetimeFormat.toDate(this.classList[index].reportEndTime),
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
            this.classList[index].reportEndTime = this.$datetimeFormat.format(selectedText)
          }
        }).show()
      }
    },
    deleteSeminar() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定删除该讨论课吗？',
        onConfirm: () => {
          this.$http.delete('/seminar/' + this.seminarID).then(() => {
            this.$createToast({
              time: 500,
              txt: '删除成功',
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
      }).show()
    },
    modifySeminar() {
      this.$http.put('/seminar/' + this.seminarID, {
        id: this.seminarInfo.id,
        seminarName: this.seminarInfo.topic,
        introduction: this.seminarInfo.intro,
        maxTeam: this.seminarInfo.teamNumLimit,
        beVisible: this.seminarInfo.beVisible ? 1 : 0,
        seminarSerial: this.seminarInfo.order,
        roundOrder: this.seminarInfo.round === undefined ? this.roundOptions.length : (this.seminarInfo.round === 'new' ? this.roundOptions.length : undefined),
        round: (this.seminarInfo.round === undefined || this.seminarInfo.round === 'new') ? undefined : { id: this.seminarInfo.round },
        enrollStartTime: this.seminarInfo.signUpStartTime,
        enrollEndTime: this.seminarInfo.signUpEndTime
      }).then(() => {
        this.classList.forEach((element, index, array) => {
          this.$http.put('/seminar/' + this.seminarID + '/class/' + element.id + '/reportddl', {
            reportDDL: element.reportEndTime
          }).then(() => {
            if (index === this.classList.length - 1) {
              this.$createToast({
                time: 500,
                txt: '修改成功',
                type: 'correct',
                onTimeout: () => {
                  this.$router.back()
                }
              }).show()
            }
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        })
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
    this.$http.get('/seminar/' + this.seminarID).then(response => {
      this.seminarInfo = response
      this.seminarInfo.round = response.roundID
      let visible = this.seminarInfo.beVisible
      this.seminarInfo.beVisible = visible === 1 ? true : false
      this.seminarInfo.signUpStartTime = response.signUpStartTime.substring(0, 19)
      this.seminarInfo.signUpEndTime = response.signUpEndTime.substring(0, 19)
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
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    })
    this.$http.get('/course/' + this.courseID + '/class').then(response => {
      response.forEach(element => {
        this.$http.get('/seminar/' + this.seminarID + '/class/' + element.id).then(res => {
          if (res.status === 2) {
            this.classList.push({
              id: element.id,
              name: element.name,
              reportEndTime: res.reportDDL.substring(0, 19)
            })
          }
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
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
