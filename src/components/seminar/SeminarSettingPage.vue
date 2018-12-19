<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">{{'第'+round+'轮'}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div class="content-text">讨论课</div>
      <el-row>
        <el-col :offset="4" :span="20">
          <div class="content-text small-gap">讨论课名称</div>
        </el-col>
      </el-row>
      <div class="content-text normal-gap">成绩设置</div>
      <cube-form :model="scoreRule" :schema="schemaScore" class="content-text"></cube-form>
      <div class="content-text normal-gap">本轮讨论课报名次数</div>
      <cube-form :model="attendanceRule" :schema="schemaAttendance" class="content-text"></cube-form>
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
      scoreRule: {
        presentationRule: undefined,
        questionRule: undefined,
        reportRule: undefined
      }
    }
  },
  computed: {
    attendanceRule() {
      return [{
        times: undefined
      }, {
        times: undefined
      }]
    },
    schemaScore() {
      return {
        fields: [{
          type: 'select',
          modelKey: 'presentationRule',
          label: '课堂展示',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'questionRule',
          label: '课堂提问',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'reportRule',
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
      this.attendanceRule.forEach((value, index, array) => {
        optionsList.push(index + 1)
      })
      return optionsList
    },
    schemaAttendance() {
      let selectList = []
      this.attendanceRule.forEach((value, index, array) => {
        selectList.push({
          type: 'select',
          modelKey: value.times,
          label: '班级名',
          props: {
            options: this.ruleOptions
          },
          rules: {
            required: true
          }
        })
      })
      return {
        fields: selectList
      }
    }
  },
  methods: {
    modifySeminar() {
      this.$createToast({
        time: 500,
        txt: '修改成功',
        type: 'correct',
        onTimeout: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
