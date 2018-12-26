<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-sub-header role="teacher" :is-mobile="true">新建讨论课</common-sub-header>
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
          v-model="seminarInfo.require"
          placeholder="讨论课主要内容、要求、具体讨论部分..."
          class="content-text"
        ></cube-textarea>
        <el-row class="small-gap">
          <el-col :span="12">
            <div class="content-text">讨论课可见</div>
          </el-col>
          <el-col :span="6">
            <el-switch
              v-model="seminarInfo.isVisible"
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
          v-model="seminarInfo.startTime"
          placeholder="报名开始时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showStartTimePicker"
        ></cube-input>
        <el-row>
          <div class="small-gap content-text">展示报名截止时间</div>
        </el-row>
        <cube-input
          v-model="seminarInfo.endTime"
          placeholder="报名截止时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showEndTimePicker"
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
        require: undefined,
        order: 1,
        isVisible: true,
        startTime: undefined,
        endTime: undefined,
        teamLimit: 1,
        isChosenAttendanceOrder: true,
        round: undefined,
        visibleStatus: '可见'
      },
      orderOptions: [{
        value: 1,
        text: '1'
      }, {
        value: 2,
        text: '2'
      }, {
        value: 3,
        text: '3'
      }, {
        value: 4,
        text: '4'
      }],
      roundOptions: [{
        value: 1,
        text: '第1轮'
      }, {
        value: 2,
        text: '第2轮'
      }, {
        value: 3,
        text: '第3轮'
      }, {
        value: 4,
        text: '第4轮'
      }]
    }
  },
  computed: {
    visibleStatus() {
      return this.seminarInfo.visibleStatus
    },
    schemaSeminar() {
      return {
        fields: [{
          type: 'select',
          modelKey: 'order',
          label: '讨论课次序号',
          props: {
            options: this.orderOptions
          },
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
          modelKey: 'teamLimit',
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
          this.seminarInfo.startTime = this.$datetimeFormat.format(selectedText)
        }
      }).show()
    },
    showEndTimePicker() {
      if (this.seminarInfo.startTime === undefined) {
        this.$createToast({
          time: 500,
          txt: '请先选择开始时间',
          type: 'warn'
        }).show()
      } else {
        this.$createDatePicker({
          title: '结束时间',
          min: this.$datetimeFormat.toDate(this.seminarInfo.startTime),
          max: new Date(2020, 9, 20, 23, 59, 59),
          value: this.$datetimeFormat.toDate(this.seminarInfo.startTime),
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
            this.seminarInfo.endTime = this.$datetimeFormat.format(selectedText)
          }
        }).show()
      }
    },
    setVisibleStatus() {
      this.seminarInfo.visibleStatus = this.seminarInfo.isVisible ? '可见' : '不可见'
    },
    createSeminar() {
      this.$createToast({
        time: 500,
        txt: '发布成功',
        type: 'correct',
        onTimeOut: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
