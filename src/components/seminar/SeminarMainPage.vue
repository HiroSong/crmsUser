<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">讨论课总界面</common-sub-header>
    </el-header>
    <el-main>
      <el-table :data="courseList" row-class-name="content-text" :show-header="false">
        <el-table-column min-width="100%" align="left">
          <template slot-scope="scope">
            <div @click="enterSeminar">
              <el-row>
                <el-col :span="2">
                  <div class="iconfont icon-book orange-text"></div>
                </el-col>
                <el-col :span="22">
                  <div class="content-text">{{scope.row.name}}</div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="big-gap" type="flex" justify="end">
        <div class="orange-text" style="font-size: 0.875rem;" @click="showSeminarPicker">正在进行的讨论课</div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarMainPage',
  components: {
    'common-sub-header': CommonSubHeader,
  },
  data() {
    return {
      courseList: [{
        name: 'OOAD'
      }]
    }
  },
  methods: {
    enterSeminar() {
      this.$router.push('/seminar')
    },
    showSeminarPicker() {
      this.$createSegmentPicker({
        data: [{
          title: '课程',
          data: [[{
            text: 'OOAD',
            value: 1
          },
          {
            text: 'J2EE',
            value: 2
          }]],
          selectedIndex: [0]
        }, {
          title: '班级',
          data: [[{
            text: '2016(1)',
            value: 1
          }]],
          selectedIndex: [0]
        }, {
          title: '讨论课',
          data: [[{
            text: '需求分析',
            value: 1
          }]],
          selectedIndex: [0]
        }],
        cancelTxt: '取消',
        confirmTxt: '确定',
        onNext: (i, selectedDate, selectedValue, selectedText) => {
        },
        onSelect: () => {
          this.$router.push('/seminar/process')
        }
      }).show()
    }
  }
}
</script>
