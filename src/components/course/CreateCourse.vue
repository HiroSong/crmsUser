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
          <div class="normal-gap content-text">组员基本要求</div>
        </el-row>
        <el-row>
          <div class="small-gap tip-text bold-text">小组总人数(包括组长)</div>
        </el-row>
        <cube-input
          v-model="courseInfo.maxNum"
          placeholder="上限"
          type="number"
          class="small-gap tip-text"
        ></cube-input>
        <cube-input v-model="courseInfo.minNum" placeholder="下限" type="number" class="tip-text"></cube-input>
        <el-row class="small-gap" type="flex" justify="space-between">
          <div class="tip-text bold-text">组内选修课程人数</div>
          <div class="el-icon-circle-plus-outline orange-text" @click="showNumLimitCourse"></div>
        </el-row>
        <el-table
          :data="courseInfo.numLimitCourse"
          header-row-class-name="tip-text bold-text"
          row-class-name="tip-text"
        >
          <el-table-column label="课程" prop="course" align="center" min-width="40%">
            <template slot-scope="scope">
              <div class="tip-text">{{scope.row.course+"("+scope.row.teacher+")"}}</div>
            </template>
          </el-table-column>
          <el-table-column label="上限" prop="maxNum" align="center" min-width="20%"></el-table-column>
          <el-table-column label="下限" prop="minNum" align="center" min-width="20%"></el-table-column>
          <el-table-column align="center" min-width="20%">
            <template slot-scope="scope">
              <div
                class="el-icon-circle-close-outline orange-text"
                @click="deleteSelect(scope.$index,courseInfo.numLimitCourse)"
              ></div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="numLimitCourseNum>1" class="small-gap">
          <el-row>
            <div class="tip-text bold-text">选修课人数要求</div>
          </el-row>
          <cube-select
            v-model="courseInfo.numLimitRule"
            :options="numLimitRuleOptions"
            placeholder="请选择"
            class="small-gap tip-text"
          ></cube-select>
          <el-row type="flex" justify="end" class="small-gap">
            <div class="tip-text text-end">* 均满足指选课人数均需达到要求
              <br>满足其一指任意选课人数满足即可
            </div>
          </el-row>
        </div>
        <el-row>
          <div class="normal-gap content-text">组队开始时间</div>
        </el-row>
        <cube-input
          v-model="courseInfo.startTime"
          placeholder="开始时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showStartTimePicker"
        ></cube-input>
        <el-row>
          <div class="small-gap content-text">组队截止时间</div>
        </el-row>
        <cube-input
          v-model="courseInfo.endTime"
          placeholder="截止时间"
          type="datetime-local"
          :readonly="true"
          :disabled="true"
          class="small-gap content-text"
          @click.native="showEndTimePicker"
        ></cube-input>
        <el-row class="small-gap" type="flex" justify="space-between">
          <div class="content-text">冲突课程</div>
          <div class="el-icon-circle-plus-outline orange-text" @click="showConflictCourse"></div>
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
          <div v-if="dialogType">
            <cube-input
              v-model="selectedLimit.maxNum"
              placeholder="上限"
              type="number"
              class="tip-text"
            ></cube-input>
            <cube-input
              v-model="selectedLimit.minNum"
              placeholder="下限"
              type="number"
              class="tip-text"
            ></cube-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              v-if="dialogType"
              plain
              class="orange-text"
              @click.native.prevent="setNumLimitCourse"
            >确定</el-button>
            <el-button v-else plain class="orange-text" @click.native.prevent="setConflictCourse">确定</el-button>
          </span>
        </el-dialog>
        <el-table :data="courseInfo.conflictCourse" :show-header="false" row-class-name="tip-text">
          <el-table-column prop="course" align="center"></el-table-column>
          <el-table-column prop="teacher" align="center"></el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">
              <div
                class="el-icon-circle-close-outline orange-text"
                @click="deleteSelect(scope.$index,courseInfo.conflictCourse)"
              ></div>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" class="small-gap">
          <div class="tip-text text-end">* 选修不同冲突课程的学生不可同组
            <br>注意同课程名不同教师为不同课程
          </div>
        </el-row>
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
        startTime: undefined,
        endTime: undefined,
        numLimitCourse: [],
        numLimitRule: undefined,
        conflictCourse: [{
          course: 'J2EE',
          teacher: '邱明',
          id: 1
        }]
      },
      numLimitRuleOptions: [{
        value: true,
        text: "均满足"
      }, {
        value: false,
        text: "满足其一"
      }],
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
      totalCourseList: [],
      courseList: [],
      dialogVisible: false,
      dialogType: true,
      selectedCourse: undefined,
      selectedLimit: {
        minNum: undefined,
        maxNum: undefined
      }
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
    },
    numLimitCourseNum() {
      return this.courseInfo.numLimitCourse.length
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
          this.courseInfo.startTime = this.$datetimeFormat.format(selectedText)
        }
      }).show()
    },
    showEndTimePicker() {
      if (this.courseInfo.startTime === undefined) {
        this.$createToast({
          time: 500,
          txt: '请先选择开始时间',
          type: 'warn'
        }).show()
      } else {
        this.$createDatePicker({
          title: '结束时间',
          min: this.$datetimeFormat.toDate(this.courseInfo.startTime),
          max: new Date(2020, 9, 20, 23, 59, 59),
          value: this.$datetimeFormat.toDate(this.courseInfo.startTime),
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
            this.courseInfo.endTime = this.$datetimeFormat.format(selectedText)
          }
        }).show()
      }
    },
    getCourseOption() {
      // 根据dialogType决定筛选方法
      // 从totalCourse中选择
      // 记得返回的是未选取过的课程
      this.courseList = []
      this.courseList.push({
        label: '.Net' + '(' + '杨律青' + ')',
        value: 1
      })
    },
    showNumLimitCourse() {
      this.dialogType = true
      this.showCourseOption()
    },
    showConflictCourse() {
      this.dialogType = false
      this.showCourseOption()
    },
    showCourseOption() {
      this.getCourseOption()
      this.dialogVisible = true
    },
    getSingleCourse(courseId) {
      return {
        course: '.Net',
        teacher: '杨律青',
        id: 2
      }
    },
    setNumLimitCourse() {
      let singleCourse = this.getSingleCourse(this.selectedCourse)
      singleCourse.minNum = this.selectedLimit.minNum
      singleCourse.maxNum = this.selectedLimit.maxNum
      this.courseInfo.numLimitCourse.push(singleCourse)
      this.dialogVisible = false
      this.selectedCourse = undefined
      this.selectedLimit.minNum = undefined
      this.selectedLimit.maxNum = undefined
    },
    setConflictCourse() {
      let course = this.getSingleCourse(this.selectedCourse)
      this.courseInfo.conflictCourse.push(course)
      this.dialogVisible = false
      this.selectedCourse = undefined
    },
    deleteSelect(index, rows) {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '确定要删除吗？',
        icon: 'cubeic-alert',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        onConfirm: () => {
          rows.splice(index, 1)
        }
      }).show()
    },
    createCourse() {
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
