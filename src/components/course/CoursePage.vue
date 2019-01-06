<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">课程</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse accordion v-if="role==='teacher' && tableData.length!==0">
        <el-collapse-item v-for="(item,index) in tableData" :key="index" :title="item.courseName">
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/course/score', query: {courseID: item.id, courseName: item.courseName}}"
              class="no-decoration tip-text"
            >学生成绩</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/team', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >学生组队</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/course/info', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >课程信息</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/course/class', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >班级信息</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/seminar', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >讨论课设置</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/application', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >共享设置</router-link>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-collapse accordion v-else-if="tableData.length!==0">
        <el-collapse-item
          v-for="(item,index) in tableData"
          :key="index"
          :title="item.courseName+' '+item.klassGrade+'('+item.klassSerial+')'"
        >
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/course/info', query: {courseID: item.id}}"
              class="no-decoration tip-text"
            >课程信息</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/course/score', query: {courseID: item.id, courseName: item.courseName}}"
              class="no-decoration tip-text"
            >我的成绩</router-link>
          </el-row>
          <el-row type="flex" justify="center">
            <router-link
              :to="{path: '/team', query: {courseID: item.id,classID: item.klassID}}"
              class="no-decoration tip-text"
            >我的组队</router-link>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row type="flex" justify="center" class="big-gap" v-if="role==='teacher'">
        <router-link to="/course/create" class="no-decoration">
          <el-button plain class="orange-text">新建课程</el-button>
        </router-link>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-header></common-header>
    </el-header>
    <el-main class="main-gap">
      <title-card>选择课程</title-card>
      <el-card class="normal-gap" shadow="hover">
        <div style="height: 65vh;">
          <el-scrollbar class="full-height">
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-table :data="tableData" row-class-name="content-text" :show-header="false">
                  <el-table-column prop="courseName" align="center"></el-table-column>
                  <el-table-column fixed="right" align="center">
                    <template slot-scope="scope">
                      <el-row type="flex" justify="center">
                        <el-button
                          plain
                          size="small"
                          @click.native.prevent="enter(scope.row.id,scope.row.klassID)"
                        >进入</el-button>
                      </el-row>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
import CommonSubHeader from '@/components/common/CommonSubHeader'
import TitleCard from '@/components/common/TitleCard'

export default {
  name: 'CoursePage',
  components: {
    'common-header': CommonHeader,
    'common-sub-header': CommonSubHeader,
    'title-card': TitleCard
  },
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  methods: {
    enter(id, classID) {
      if (this.role === 'teacher') {
        this.$router.push({ path: '/seminar', query: { courseID: id } })
      } else {
        this.$router.push({ path: '/seminar', query: { courseID: id, classID: classID } })
      }
    }
  },
  created() {
    this.$http.get('/course').then(response => {
      response.forEach(element => {
        this.tableData.push(element)
      });
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
