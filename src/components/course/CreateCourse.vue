<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-sub-header role="teacher" :is-mobile="true">新建课程</common-sub-header>
      </el-header>
      <el-main class="main-gap">
        <cube-input
          v-model="courseInfo.name"
          placeholder="课程名称"
          type="text"
          :clearable="true"
          :autofocus="true"
          class="content-text"
        ></cube-input>
        <cube-textarea v-model="courseInfo.require" placeholder="课程要求" class="content-text"></cube-textarea>
        <el-row>
          <div class="small-gap content-text">成绩计算规则</div>
        </el-row>
        <cube-form :model="courseInfo" :schema="schemaScore" class="content-text"></cube-form>
        <el-row>
          <div class="small-gap content-text">小组人数</div>
        </el-row>
        <cube-input
          v-model="courseInfo.maxNum"
          placeholder="上限"
          type="number"
          class="small-gap content-text"
        ></cube-input>
        <cube-input v-model="courseInfo.minNum" placeholder="下限" type="number" class="content-text"></cube-input>
        <el-row>
          <div class="small-gap content-text">组队开始时间</div>
        </el-row>
        <cube-input
          v-model="courseInfo.startDate"
          placeholder="日期"
          type="date"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showStartDatePicker"
        ></cube-input>
        <cube-input
          v-model="courseInfo.startTime"
          placeholder="时间"
          type="time"
          :readonly="true"
          :disabled="true"
          class="content-text"
          @click.native="showStartTimePicker"
        ></cube-input>
        <el-row>
          <div class="small-gap content-text">组队截止时间</div>
        </el-row>
        <cube-input
          v-model="courseInfo.endDate"
          placeholder="日期"
          type="date"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showEndDatePicker"
        ></cube-input>
        <cube-input
          v-model="courseInfo.endTime"
          placeholder="时间"
          type="time"
          :readonly="true"
          :disabled="true"
          class="content-text"
          @click.native="showEndTimePicker"
        ></cube-input>
        <el-row class="small-gap">
          <el-col :span="18">
            <div class="small-gap content-text">冲突课程</div>
          </el-col>
          <el-col :span="6">
            <el-button
              type="text"
              plain
              class="el-icon-circle-plus-outline orange-text"
              circle
              @click.native.prevent="showCourse"
            ></el-button>
          </el-col>
        </el-row>
        <el-dialog title="选择课程" :visible.sync="dialogVisible" width="80vw" class="content-text">
          <el-select
            v-model="selectedCourse"
            filterable
            placeholder="请输入教师/课程名称"
            class="content-text"
            size="medium"
            no-data-text="暂时没有课程可选"
          >
            <el-option
              v-for="item in courseList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              class="content-text"
            ></el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button plain class="orange-text" @click.native.prevent="setConflictCourse">确定</el-button>
          </span>
        </el-dialog>
        <el-table
          :data="courseInfo.conflictCourse"
          :show-header="false"
          row-class-name="content-text"
        >
          <el-table-column prop="course" align="center"></el-table-column>
          <el-table-column prop="teacher" align="center"></el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                plain
                circle
                class="el-icon-circle-close-outline orange-text"
                @click.native.prevent="deleteConflictCourse(scope.$index,courseInfo.conflictCourse)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="12">
            <el-button plain class="orange-text full-width" @click.native.prevent="createCourse">发布</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'CreateCoursePage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      courseInfo: {
        name: undefined,
        require: undefined,
        presentationRate: 1,
        questionRate: 0,
        reportRate: 0,
        minNum: undefined,
        maxNum: undefined,
        startDate: undefined,
        startTime: undefined,
        endDate: undefined,
        endTime: undefined,
        conflictCourse: [{
          course: 'J2EE',
          teacher: '邱明',
          id: 1
        }]
      },
      options: [{
        value: 1,
        text: '100%'
      }, {
        value: 0.9,
        text: '90%'
      }, {
        value: 0.8,
        text: '80%'
      }, {
        value: 0.7,
        text: '70%'
      }, {
        value: 0.6,
        text: '60%'
      }, {
        value: 0.5,
        text: '50%'
      }, {
        value: 0.4,
        text: '40%'
      }, {
        value: 0.3,
        text: '30%'
      }, {
        value: 0.2,
        text: '20%'
      }, {
        value: 0.1,
        text: '10%'
      }, {
        value: 0,
        text: '0%'
      }],
      courseList: [],
      dialogVisible: false,
      selectedCourse: undefined
    }
  },
  computed: {
    schemaScore() {
      return {
        fields: [{
          type: 'select',
          modelKey: 'presentationRate',
          label: '课堂展示',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'questionRate',
          label: '课堂提问',
          props: {
            options: this.options
          },
          rules: {
            required: true
          }
        }, {
          type: 'select',
          modelKey: 'reportRate',
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
    schemaTeamNum() {
      return {
        fields: [{
          type: 'input',
          modelKey: 'maxNum',
          props: {
            placeholder: '上限'
          },
          rules: {
            required: true
          }
        }, {
          type: 'input',
          modelKey: 'minNum',
          props: {
            placeholder: '下限'
          },
          rules: {
            required: true
          }
        }]
      }
    }
  },
  methods: {
    showStartDatePicker() {
      if (!this.startDatePicker) {
        this.startDatePicker = this.$createDatePicker({
          title: '开始日期',
          min: new Date(2018, 1, 1),
          max: new Date(2020, 9, 20),
          value: new Date(),
          onSelect: (date, selectedVal, selectedText) => {
            this.courseInfo.startDate = selectedText.join('-')
          },
        })
      }
      this.startDatePicker.show()
    },
    showStartTimePicker() {
      if (!this.startTimePicker) {
        this.startTimePicker = this.$createDatePicker({
          title: '开始时间',
          min: [8, 0, 0],
          max: [23, 59, 59],
          value: new Date(),
          startColumn: 'hour',
          columnCount: 2,
          onSelect: (date, selectedVal, selectedText) => {
            this.courseInfo.startTime = selectedText.join(':')
          }
        })
      }
      this.startTimePicker.show()
    },
    showEndDatePicker() {
      if (!this.endDatePicker) {
        this.endDatePicker = this.$createDatePicker({
          title: '结束日期',
          min: new Date(2018, 1, 1),
          max: new Date(2020, 9, 20),
          value: new Date(),
          onSelect: (date, selectedVal, selectedText) => {
            this.courseInfo.endDate = selectedText.join('-')
          },
        })
      }
      this.endDatePicker.show()
    },
    showEndTimePicker() {
      if (!this.endTimePicker) {
        this.endTimePicker = this.$createDatePicker({
          title: '结束时间',
          min: [8, 0, 0],
          max: [23, 59, 59],
          value: new Date(),
          startColumn: 'hour',
          columnCount: 2,
          onSelect: (date, selectedVal, selectedText) => {
            this.courseInfo.endTime = selectedText.join(':')
          }
        })
      }
      this.endTimePicker.show()
    },
    getCourse() {
      //记得返回的是未选取过的课程
      this.courseList = []
      this.courseList.push({
        label: '.Net' + '(' + '杨律青' + ')',
        value: 1
      })
    },
    showCourse() {
      this.getCourse()
      this.dialogVisible = true
    },
    getSingleCourse(courseId) {
      return {
        course: '.Net',
        teacher: '杨律青',
        id: 2
      }
    },
    setConflictCourse() {
      let course = this.getSingleCourse(this.selectedCourse)
      this.courseInfo.conflictCourse.push(course)
      this.dialogVisible = false
      this.selectedCourse = undefined
    },
    deleteConflictCourse(index, rows) {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '确定要删除吗？',
        icon: 'cubeic-alert',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
        },
        onConfirm: () => {
          rows.splice(index, 1)
        }
      }).show()
    },
    createCourse(courseId) {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '创建成功',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
        },
        onConfirm: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
