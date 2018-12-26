<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseInfo.name}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-row>
        <div class="content-text">课程要求</div>
      </el-row>
      <cube-textarea
        v-model="courseInfo.require"
        placeholder="无"
        :readonly="true"
        :disabled="true"
        :indicator="true"
        :autoExpand="true"
        class="small-gap"
      ></cube-textarea>
      <el-table
        :data="tableData"
        :show-header="false"
        :span-method="arraySpan"
        row-class-name="content-text"
      >
        <el-table-column prop="text" align="left"></el-table-column>
        <el-table-column prop="value" align="left"></el-table-column>
      </el-table>
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <div class="content-text">组队要求</div>
          </template>
          <el-row>
            <div class="content-text">组员基本要求</div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="tip-text bold-text">小组总人数(含组长)</div>
            </el-col>
            <el-col :span="12">
              <div class="tip-text">{{courseInfo.minNum+"~"+courseInfo.maxNum}}</div>
            </el-col>
          </el-row>
          <el-row>
            <div class="tip-text bold-text">组内选修课程人数</div>
          </el-row>
          <div v-for="(item,index) in courseInfo.numLimitCourse" :key="index">
            <el-row>
              <el-col :span="12">
                <div class="tip-text">{{item.course+"("+item.teacher+")"}}</div>
              </el-col>
              <el-col :span="12">
                <div class="tip-text">{{item.minNum+"~"+item.maxNum}}</div>
              </el-col>
            </el-row>
          </div>
          <el-row type="flex" justify="end" class="small-gap">
            <div v-if="courseInfo.numLimitRule" class="tip-text text-end">* 要求：均满足</div>
            <div v-else class="tip-text text-end">* 要求：满足其一</div>
          </el-row>
          <el-row>
            <div class="small-gap content-text">冲突课程</div>
          </el-row>
          <div v-for="(item,index) in courseInfo.conflictCourse" :key="index">
            <el-row>
              <div class="tip-text bold-text">{{item.course+"("+item.teacher+")"}}</div>
            </el-row>
          </div>
          <el-row type="flex" justify="end" class="small-gap">
            <div class="tip-text text-end">* 选修不同冲突课程的学生不可同组
              <br>注意同课程名不同教师为不同课程
            </div>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row v-if="isMainCourse" type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button
            type="danger"
            plain
            class="full-width"
            @click.native.prevent="deleteCourse"
          >删除课程</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>


<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'CourseInfoPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      courseInfo: {
        id: undefined,
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
      isMainCourse: undefined,
      spanArr: undefined
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    tableData() {
      let data = [
        {
          text: '成绩计算规则',
          value: '课堂展示 ' + this.courseInfo.presentationRate * 100 + '%'
        },
        {
          text: '成绩计算规则',
          value: '课堂提问 ' + this.courseInfo.questionRate * 100 + '%'
        },
        {
          text: '成绩计算规则',
          value: '书面报告 ' + this.courseInfo.reportRate * 100 + '%'
        },
        {
          text: '组队开始时间',
          value: this.courseInfo.startTime
        },
        {
          text: '组队截止时间',
          value: this.courseInfo.endTime
        }
      ]
      return data
    }
  },
  created() {
    this.spanArr = []
    let curIndex = 0
    this.tableData.forEach((value, index, arr) => {
      if (index === 0) {
        this.spanArr.push(1)
      } else {
        if (arr[index - 1].text === value.text) {
          this.spanArr[curIndex]++
          this.spanArr.push(0)
        }
        else {
          this.spanArr.push(1)
          curIndex = index
        }
      }
    })
  },
  activated() {
    this.spanArr = []
    let curIndex = 0
    this.tableData.forEach((index, value, array) => {
      if (index === 0) {
        this.spanArr.push(1)
      } else {
        if (array[index - 1].text === value.text) {
          this.spanArr[curIndex]++
          this.spanArr.push(0)
        }
        else {
          this.spanArr.push(1)
          curIndex = index
        }
      }
    })
  },
  methods: {
    arraySpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    deleteCourse() {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '删除成功',
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