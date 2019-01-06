<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div v-if="sortedRoundSeminarList.length===0" class="content-text bold-text text-center">暂无数据</div>
      <div v-else>
        <el-collapse accordion>
          <el-collapse-item v-for="(item,index) in sortedRoundSeminarList" :key="index">
            <template slot="title">
              <div class="content-text bold-text">{{'第'+item.round.order+'轮讨论课'}}</div>
            </template>
            <div v-if="role==='teacher'">
              <el-row>
                <div
                  class="iconfont icon-shezhi content-text full-width text-start"
                  @click="enterSetting(item.round.id)"
                >该轮轮次设置</div>
              </el-row>
              <el-collapse accordion>
                <el-collapse-item v-for="(seminar,ind) in item.seminarList" :key="ind">
                  <template slot="title">
                    <div class="content-text more-text">{{seminar.order+'-'+seminar.topic}}</div>
                    <div class="iconfont icon-xiugai orange-text" @click="enterModify(seminar.id)"></div>
                  </template>
                  <el-row v-for="(classInfo,order) in classList" :key="order">
                    <el-button
                      type="text"
                      plain
                      class="tip-text full-width"
                      @click.native.prevent="enterSeminar(seminar.id, classInfo.id)"
                    >{{classInfo.name}}</el-button>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-else>
              <el-row v-for="(seminar,ind) in item.seminarList" :key="ind">
                <div
                  class="content-text full-width text-start more-text"
                  @click="enterSeminar(seminar.id, classID)"
                >{{seminar.order+'-'+seminar.topic}}</div>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-row type="flex" justify="center" v-if="role==='teacher'">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="enterCreate"
          >新建讨论课</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-sub-header :role="role"></common-sub-header>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <common-aside :role="role" :courseID="courseID" :class="classID"></common-aside>
      </el-aside>
      <el-main class="main-gap">
        <title-card>{{modifiedTitle}}</title-card>
        <el-card shadow="hover" class="normal-gap">
          <div style="height: 60vh;">
            <el-scrollbar class="full-height">
              <el-row type="flex" justify="center">
                <el-col :span="12">
                  <el-collapse accordion>
                    <el-collapse-item
                      class="content-text"
                      v-for="(item,index) in sortedRoundSeminarList"
                      :key="index"
                    >
                      <template slot="title">
                        <div class="sub-title-text bold-text">{{'第'+item.round.order+'轮讨论课'}}</div>
                      </template>
                      <el-table
                        :data="item.seminarList"
                        :show-header="false"
                        row-class-name="content-text"
                      >
                        <el-table-column prop="topic" align="center"></el-table-column>
                        <el-table-column fixed="right" align="center">
                          <template slot-scope="scope">
                            <el-button
                              plain
                              type="primary"
                              size="small"
                              @click.native.prevent="enterSeminar(scope.row.id,classID)"
                            >进入</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import CommonAside from '@/components/common/CommonAside'
import TitleCard from '@/components/common/TitleCard'

export default {
  name: 'SeminarPage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      roundSeminarList: [],
      classList: [],
      courseName: undefined,
      dialogFormVisible: false
    }
  },
  computed: {
    modifiedTitle() {
      return this.courseName + '-讨论课'
    },
    role() {
      return this.$store.state.role
    },
    isMobile() {
      return this.$store.state.isMobile
    },
    courseID() {
      return this.$route.query.courseID
    },
    classID() {
      return this.$route.query.classID
    },
    sortedRoundSeminarList() {
      return this.roundSeminarList.sort((a, b) => {
        return a.round.order - b.round.order
      })
    }
  },
  methods: {
    enterSeminar(id, classID) {
      this.$router.push({ path: '/seminar/info', query: { seminarID: id, classID: classID, courseID: this.courseID } })
    },
    enterSetting(id) {
      this.$router.push({ path: '/seminar/setting', query: { roundID: id } })
    },
    enterModify(id) {
      this.$router.push({ path: '/seminar/modify', query: { seminarID: id, courseID: this.courseID } })
    },
    enterCreate() {
      this.$router.push({ path: '/seminar/create', query: { courseID: this.courseID } })
    }
  },
  created() {
    this.$http.get('/course/' + this.courseID + '/round').then(response => {
      response.forEach(element => {
        this.$http.get('/round/' + element.id + '/seminar').then(res => {
          let seminarList = []
          res.forEach((val, index, arr) => {
            seminarList.push(val)
          })
          this.roundSeminarList.push({ round: element, seminarList: seminarList })
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      })
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    if (this.role === 'teacher') {
      this.$http.get('/course/' + this.courseID + '/class').then(response => {
        response.forEach(element => {
          this.classList.push(element)
        })
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    }
    this.$http.get('/course/' + this.courseID).then(response => {
      this.courseName = response.name
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
