<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">讨论课总界面</common-sub-header>
    </el-header>
    <el-main>
      <el-table :data="courseList" row-class-name="content-text" :show-header="false">
        <el-table-column min-width="100%" align="left">
          <template slot-scope="scope">
            <div @click="enterSeminar(scope.row.id,scope.row.klassID)">
              <el-row>
                <el-col :span="2">
                  <div class="iconfont icon-book orange-text"></div>
                </el-col>
                <el-col :span="22">
                  <div v-if="role==='teacher'" class="content-text">{{scope.row.courseName}}</div>
                  <div
                    v-else
                    class="content-text"
                  >{{scope.row.courseName+' '+scope.row.klassGrade+'('+scope.row.klassSerial+')'}}</div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="role==='teacher'" class="big-gap" type="flex" justify="end">
        <div class="orange-text" style="font-size: 0.875rem;" @click="enterProcessSeminar">正在进行的讨论课</div>
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
      courseList: []
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    enterSeminar(id, klassID) {
      this.$router.push({ path: '/seminar', query: { courseID: id, classID: klassID } })
    },
    enterProcessSeminar() {
      this.$http.get('/seminar/process').then(response => {
        if (response.id !== undefined) {
          this.$router.push({ path: '/seminar/process', query: { seminarID: response.id, classID: response.klassID } })
        } else {
          this.$createToast({
            time: 500,
            txt: '暂无正在进行的讨论课',
            type: "error"
          }).show()
        }
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
  },
  created() {
    this.$http.get('/course').then(response => {
      response.forEach(element => {
        this.courseList.push(element)
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
