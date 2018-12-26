<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-sub-header role="teacher" :is-mobile="true">新建课程</common-sub-header>
      </el-header>
      <el-main class="main-gap">
        <cube-validator :model="courseInfo.name" :rules="{required: true}" v-model="nameValid">
          <cube-input
            v-model="courseInfo.name"
            placeholder="课程名称"
            type="text"
            :clearable="true"
            :autofocus="true"
            class="content-text"
          ></cube-input>
        </cube-validator>
        <cube-textarea v-model="courseInfo.require" placeholder="课程要求" class="content-text"></cube-textarea>
        <el-row>
          <div class="small-gap content-text">成绩计算规则</div>
        </el-row>
        <cube-validator
          :model="courseInfo.presentationRate"
          :rules="{sumValid: val=>val+ this.courseInfo.questionRate + this.courseInfo.reportRate===100}"
          :messages="{sumValid: '权重总和必须为100%'}"
          :immediate="true"
          v-model="rateValid"
          ref="rateValidator"
        >
          <cube-form :model="courseInfo" :schema="schemaScore" class="content-text"></cube-form>
        </cube-validator>
        <el-row>
          <div class="normal-gap content-text">组员基本要求</div>
        </el-row>
        <el-row>
          <div class="small-gap tip-text bold-text">小组总人数(包括组长)</div>
        </el-row>
        <cube-validator
          :model="courseInfo.maxNum"
          :rules="{numRule: val=>val>this.courseInfo.minNum||this.courseInfo.minNum===undefined}"
          :messages="{numRule: '上限应该高于下限'}"
          v-model="numValid"
          ref="numRuleCourseValidator"
        >
          <cube-input
            v-model="courseInfo.maxNum"
            placeholder="上限"
            type="number"
            class="small-gap tip-text"
            @focus="e=>this.$refs.numRuleCourseValidator.validate()"
          ></cube-input>
          <cube-input
            v-model="courseInfo.minNum"
            placeholder="下限"
            type="number"
            class="tip-text"
            @focus="e=>this.$refs.numRuleCourseValidator.validate()"
          ></cube-input>
        </cube-validator>
        <el-row class="small-gap" type="flex" justify="space-between">
          <div class="tip-text bold-text">组内选修课程人数</div>
          <div class="el-icon-circle-plus-outline orange-text" @click="showNumLimitCourse"></div>
        </el-row>
        <el-table
          :data="numLimitCourse"
          header-row-class-name="tip-text bold-text"
          row-class-name="tip-text"
        >
          <el-table-column label="课程" align="center" min-width="40%">
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
              <br>内部新增按钮为一个策略内的课程之间的或关系
            </div>
          </el-row>
        </div>
        <el-row>
          <div class="normal-gap content-text">
            <span class="red-text" style="font-size: 0.875rem;">*</span>组队开始时间
          </div>
        </el-row>
        <cube-validator
          :model="courseInfo.startTime"
          :rules="{required: true}"
          v-model="startTimeValid"
        >
          <cube-input
            v-model="courseInfo.startTime"
            placeholder="开始时间"
            type="datetime-local"
            :readonly="true"
            :disabled="true"
            class="small-gap content-text"
            @click.native="showStartTimePicker"
          ></cube-input>
        </cube-validator>
        <el-row>
          <div class="small-gap content-text">
            <span class="red-text" style="font-size: 0.875rem;">*</span>组队截止时间
          </div>
        </el-row>
        <cube-validator
          :model="courseInfo.endTime"
          :rules="{required: true}"
          v-model="endTimeValid"
        >
          <cube-input
            v-model="courseInfo.endTime"
            placeholder="截止时间"
            type="datetime-local"
            :readonly="true"
            :disabled="true"
            class="small-gap content-text"
            @click.native="showEndTimePicker"
          ></cube-input>
        </cube-validator>
        <el-row class="small-gap" type="flex" justify="space-between">
          <div class="content-text">冲突课程</div>
          <div class="el-icon-circle-plus-outline orange-text" @click="addConflictCourseGroup"></div>
        </el-row>
        <div v-for="(item,index) in courseInfo.conflictCourse" :key="index">
          <div v-if="item.length===0">
            <el-row class="small-gap">
              <div class="tip-text text-center">该分组暂无课程</div>
            </el-row>
            <el-row type="flex" justify="center">
              <el-button
                plain
                class="orange-text"
                size="mini"
                @click.native.prevent="showConflictCourse(index)"
              >添加新课程</el-button>
            </el-row>
            <hr width="80%" color="#000000" size="1" align="left">
          </div>
          <div v-else>
            <el-table :data="item" :show-header="false" row-class-name="tip-text">
              <el-table-column prop="course" align="center" min-width="40%"></el-table-column>
              <el-table-column prop="teacher" align="center" min-width="40%"></el-table-column>
              <el-table-column align="center" min-width="20%">
                <template slot-scope="scope">
                  <div
                    class="el-icon-circle-close-outline orange-text"
                    @click="deleteSelect(scope.$index,courseInfo.conflictCourse[index])"
                  ></div>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
              <el-button
                plain
                class="orange-text"
                size="mini"
                @click="showConflictCourse(index)"
              >添加新课程</el-button>
            </el-row>
            <hr width="80%" color="#000000" size="1" align="left">
          </div>
        </div>
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
        <el-dialog title="选择课程" :visible.sync="dialogVisible" width="80vw" class="content-text">
          <el-select
            v-model="selectedCourse"
            filterable
            placeholder="请输入课程名/教师"
            class="content-text"
            size="medium"
            no-data-text="暂时没有课程可选"
            :clearable="true"
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
            <cube-validator
              :model="selectedLimit.maxNum"
              :rules="{numRule: val=>val>this.selectedLimit.minNum||this.selectedLimit.minNum===undefined}"
              :messages="{numRule: '上限应该高于下限'}"
              v-model="selectedNumValid"
              ref="selectedNumRuleCourseValidator"
            >
              <cube-input
                v-model="selectedLimit.maxNum"
                placeholder="上限"
                type="number"
                class="tip-text"
                @focus="e=>this.$refs.selectedNumRuleCourseValidator.validate()"
              ></cube-input>
              <cube-input
                v-model="selectedLimit.minNum"
                placeholder="下限"
                type="number"
                class="tip-text"
                @focus="e=>this.$refs.selectedNumRuleCourseValidator.validate()"
              ></cube-input>
            </cube-validator>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="dialogType" plain class="orange-text" @click="setNumLimitCourse">确定</el-button>
            <el-button v-else plain class="orange-text" @click="setConflictCourse">确定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import { error } from 'util';

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
        presentationRate: 100,
        questionRate: 0,
        reportRate: 0,
        minNum: undefined,
        maxNum: undefined,
        startTime: undefined,
        endTime: undefined,
        numLimitCourse: [],
        numLimitRule: undefined,
        conflictCourse: []
      },
      numLimitRuleOptions: [{
        value: true,
        text: "均满足"
      }, {
        value: false,
        text: "满足其一"
      }],
      options: [{
        value: 100,
        text: '100%'
      }, {
        value: 90,
        text: '90%'
      }, {
        value: 80,
        text: '80%'
      }, {
        value: 70,
        text: '70%'
      }, {
        value: 60,
        text: '60%'
      }, {
        value: 50,
        text: '50%'
      }, {
        value: 40,
        text: '40%'
      }, {
        value: 30,
        text: '30%'
      }, {
        value: 20,
        text: '20%'
      }, {
        value: 10,
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
      },
      conflictIndex: undefined,
      nameValid: true,
      startTimeValid: true,
      endTimeValid: true,
      rateValid: true,
      numValid: true,
      selectedNumValid: true
    }
  },
  computed: {
    numLimitCourse() {
      return this.courseInfo.numLimitCourse
    },
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
          },
          events: {
            change: (val, index, text) => {
              this.$refs.rateValidator.validate()
            }
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
          },
          events: {
            change: (val, index, text) => {
              this.$refs.rateValidator.validate()
            }
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
          },
          events: {
            change: (val, index, text) => {
              this.$refs.rateValidator.validate()
            }
          }
        }]
      }
    },
    numLimitCourseNum() {
      return this.courseInfo.numLimitCourse.length
    },
    conflictCourseStrategies() {
      let strategies = []
      this.courseInfo.conflictCourse.forEach(element => {
        element.forEach(item => {
          strategies.push({
            id: item.id,
            courseID: item.courseID
          })
        })
      })
      return strategies
    },
    courseMemberLimitStrategies() {
      let strategies = []
      this.courseInfo.numLimitCourse.forEach(element => {
        strategies.push({
          courseID: element.courseID,
          minMember: element.minNum,
          maxMember: element.maxNum
        })
      })
      return strategies
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
    showCourseOption() {
      this.dialogVisible = true
    },
    showNumLimitCourse() {
      this.dialogType = true
      this.showCourseOption()
    },
    showConflictCourse(index) {
      this.conflictIndex = index
      this.dialogType = false
      this.showCourseOption()
    },
    setNumLimitCourse() {
      this.totalCourseList.forEach(element => {
        if (element.id === this.selectedCourse) {
          this.courseInfo.numLimitCourse.push({
            course: element.courseName,
            teacher: element.teacher.name,
            courseID: element.id,
            minNum: this.selectedLimit.minNum,
            maxNum: this.selectedLimit.maxNum
          })
        }
      })
      this.dialogVisible = false
      this.selectedCourse = undefined
      this.selectedLimit.minNum = undefined
      this.selectedLimit.maxNum = undefined
    },
    setConflictCourse() {
      this.totalCourseList.forEach(element => {
        if (element.id === this.selectedCourse) {
          this.courseInfo.conflictCourse[this.conflictIndex].push({
            id: this.conflictIndex + 1,
            course: element.courseName,
            teacher: element.teacher.name,
            courseID: element.id
          })
        }
      })
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
    addConflictCourseGroup() {
      let length = this.courseInfo.conflictCourse === undefined ? 0 : this.courseInfo.conflictCourse.length
      if (length === 0) {
        this.courseInfo.conflictCourse.push([])
        return
      }
      if (this.courseInfo.conflictCourse[length - 1].length === 0) {
        this.$createToast({
          time: 500,
          txt: '已有一个冲突组',
          type: 'warn'
        }).show()
      } else {
        this.courseInfo.conflictCourse.push([])
      }
    },
    createCourse() {
      if (!(this.nameValid && this.startTimeValid && this.endTimeValid)) {
        return
      }
      this.$http.post('/course', {
        teacher: { id: this.$store.state.id },
        courseName: this.courseInfo.name,
        introduction: this.courseInfo.require,
        presentationPercentage: this.courseInfo.presentationRate,
        questionPercentage: this.courseInfo.questionRate,
        reportPercentage: this.courseInfo.reportRate,
        teamStartTime: this.courseInfo.startTime,
        teamEndTime: this.courseInfo.endTime,
        andOr: this.courseInfo.numLimitRule ? "TeamAndStrategy" : "TeamOrStrategy",
        maxMemberNumber: this.courseInfo.maxNum,
        minMemberNumber: this.courseInfo.minNum,
        courseMemberLimitStrategies: this.courseMemberLimitStrategies,
        conflictCourseStrategies: this.conflictCourseStrategies
      }).then(() => {
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
    this.$http.get('/allcourse').then(response => {
      this.totalCourseList = response
      this.totalCourseList.forEach(item => {
        this.courseList.push({
          label: item.courseName + '(' + item.teacher.name + ')',
          value: item.id
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
}
</script>
