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
      <el-row type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button
            v-if="isMainCourse"
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
          text: '小组人数',
          value: this.courseInfo.minNum + '~' + this.courseInfo.maxNum
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
      this.courseInfo.conflictCourse.forEach((value, index, arr) => {
        data.push({
          text: '冲突课程',
          value: value.course + '(' + value.teacher + ')'
        })
      })
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