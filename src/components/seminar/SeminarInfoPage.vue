<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{seminarInfo.topic}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-table :data="infoData" :show-header="false">
        <el-table-column min-width="40%">
          <template slot-scope="scope">
            <div class="tip-text bold-text">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="60%">
          <template slot-scope="scope">
            <el-row
              v-if="scope.row.title==='课程情况'&&!(seminarInfo.status==='未开始'&&role!=='teacher')"
            >
              <el-col :span="16">
                <div class="tip-text">{{scope.row.content}}</div>
              </el-col>
              <el-col :span="8">
                <div class="orange-text" style="font-size: 0.75rem" @click="enterAttendance">查看</div>
              </el-col>
            </el-row>
            <div v-else class="tip-text">{{scope.row.content}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="role==='teacher'">
        <div v-if="seminarInfo.status==='正在进行'">
          <el-row type="flex" justify="center" class="normal-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="enterProcess"
              >进入讨论课</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='未开始'">
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="enterProcess"
              >开始讨论课</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="setReportScore"
              >书面报告评分</el-button>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="enterScore"
              >查看成绩</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <div v-if="seminarInfo.status==='正在进行'">
          <el-row type="flex" justify="center" class="normal-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="enterProcess"
              >进入讨论课</el-button>
            </el-col>
          </el-row>
          <el-row v-if="attendanceID!==undefined" type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-upload
                :http-request="uploadFile"
                :action="'/attendance/' + attendanceID + '/ppt'"
                :multiple="false"
                :show-file-list="false"
                :on-success="submitSuccess"
              >
                <el-button plain class="orange-text full-width">PPT提交</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='未开始'">
          <div v-if="attendanceID!==undefined">
            <el-table :data="pptData" :show-header="false">
              <el-table-column min-width="40%">
                <template slot-scope="scope">
                  <div class="tip-text bold-text">{{scope.row.title}}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="60%">
                <template slot-scope="scope">
                  <div v-if="scope.row.title==='报名信息'">
                    <el-row>
                      <el-col :span="16">
                        <div class="tip-text">{{scope.row.content}}</div>
                      </el-col>
                      <el-col :span="8">
                        <div
                          class="orange-text"
                          style="font-size: 0.75rem"
                          @click="enterAttendance"
                        >修改</div>
                      </el-col>
                    </el-row>
                  </div>
                  <div
                    v-else-if="scope.row.content===false"
                    class="red-text"
                    style="font-size: 0.75rem;"
                  >未提交</div>
                  <div v-else class="green-text" style="font-size: 0.75rem;">已提交</div>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" class="small-gap">
              <el-col :span="12">
                <el-upload
                  :http-request="uploadFile"
                  :action="'/attendance/' + attendanceID + '/ppt'"
                  :multiple="false"
                  :show-file-list="false"
                  :on-success="submitSuccess"
                >
                  <el-button plain class="orange-text full-width">PPT提交</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-table :data="timeData" :show-header="false">
              <el-table-column min-width="40%">
                <template slot-scope="scope">
                  <div class="tip-text bold-text">{{scope.row.title}}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="60%">
                <template slot-scope="scope">
                  <div class="red-text" style="font-size: 0.75rem;">{{scope.row.content}}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-row
              v-if="canRegister&&attendanceID===undefined"
              type="flex"
              justify="center"
              class="small-gap"
            >
              <el-col :span="12">
                <el-button
                  plain
                  class="orange-text full-width"
                  @click.native.prevent="enterAttendance"
                >报名</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else-if="seminarInfo.status==='已结束'">
          <div v-if="attendanceID!==undefined">
            <el-table :data="fileData" :show-header="false">
              <el-table-column min-width="40%">
                <template slot-scope="scope">
                  <div class="tip-text bold-text">{{scope.row.title}}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="60%">
                <template slot-scope="scope">
                  <div v-if="scope.row.title==='报名信息'" class="tip-text">{{scope.row.content}}</div>
                  <div
                    v-else-if="scope.row.content===false"
                    class="red-text more-text"
                    style="font-size: 0.75rem;"
                  >未提交
                    <br>
                    {{scope.row.restTime}}
                  </div>
                  <div v-else class="green-text" style="font-size: 0.75rem;">已提交</div>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" class="small-gap">
              <el-col :span="12">
                <el-upload
                  :http-request="uploadFile"
                  :action="'/attendance/' + attendanceID + '/report'"
                  :multiple="false"
                  :show-file-list="false"
                  :on-success="submitSuccess"
                >
                  <el-button plain class="orange-text full-width">书面报告提交</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else-if="seminarInfo.status==='已截止'">
          <div v-if="attendanceID!==undefined">
            <el-table :data="fileData" :show-header="false">
              <el-table-column min-width="40%">
                <template slot-scope="scope">
                  <div class="tip-text bold-text">{{scope.row.title}}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="60%">
                <template slot-scope="scope">
                  <div v-if="scope.row.title==='报名信息'" class="tip-text">{{scope.row.content}}</div>
                  <div
                    v-else-if="scope.row.content===false"
                    class="red-text"
                    style="font-size: 0.75rem;"
                  >未提交</div>
                  <div v-else class="green-text" style="font-size: 0.75rem;">已提交</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-width"
                @click.native.prevent="enterScore"
              >查看成绩</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
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
        <el-card class="normal-gap" shadow="never">
          <div slot="header">
            <el-row>
              <el-col :span="12">
                <div class="title-text">主题：{{seminarInfo.topic}}</div>
              </el-col>
              <el-col :span="12">
                <div class="title-text text-center">报名情况：{{teamNum}}/{{seminarInfo.teamNumLimit}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="sub-title-text">
            <el-row>报名起止日期：{{signupTime}}</el-row>
            <el-row class="small-gap">讨论课报告提交截止日期：{{seminarInfo.reportDDL}}</el-row>
            <el-row class="small-gap">内容：{{seminarInfo.intro}}</el-row>
          </div>
        </el-card>
        <el-card shadow="hover" class="small-gap" v-if="role==='teacher'">
          <div slot="header">
            <el-row>
              <el-col :span="12">
                <span class="sub-title-text bold-text">已报名小组</span>
              </el-col>
              <el-col :span="12">
                <el-form>
                  <el-form-item>
                    <template slot="label">
                      <div class="content-text bold-text">班级：</div>
                    </template>
                    <el-select
                      v-model="selectedClass"
                      placeholder="请选择班级"
                      class="content-text"
                      size="medium"
                      no-data-text="暂时没有班级可选"
                      @change="getAttendance"
                    >
                      <el-option
                        v-for="(item,index) in classList"
                        :key="index"
                        :value="item.id"
                        :label="item.grade+'('+item.serial+')'"
                        class="content-text"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row class="content-text bold-text text-center small-gap">
              <el-col :span="8">展示次序</el-col>
              <el-col :span="8">小组序号</el-col>
              <el-col :span="8" v-if="seminarInfo.status==='已结束'">展示报告</el-col>
              <el-col :span="8" v-else>展示材料</el-col>
            </el-row>
          </div>
          <div style="height: 20vh">
            <el-scrollbar class="full-height">
              <el-table :data="attendanceList" :show-header="false" row-class-name="content-text">
                <el-table-column prop="teamOrder" align="center"></el-table-column>
                <el-table-column prop="teamNumber" align="center"></el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <div v-if="seminarInfo.status==='未开始'">
                      <div v-if="scope.row.pptUrl!==undefined">已上传</div>
                      <div v-else>未上传</div>
                    </div>
                    <div v-else-if="seminarInfo.status==='已结束'">
                      <el-button plain size="small" v-if="scope.row.reportUrl!==undefined">
                        <a :href="scope.row.reportUrl" :download="scope.row.reportName">下载</a>
                      </el-button>
                      <div v-else>未上传</div>
                    </div>
                    <div v-else>
                      <el-button plain size="small" v-if="scope.row.pptUrl!==undefined">
                        <a :href="scope.row.pptUrl" :download="scope.row.pptName">下载</a>
                      </el-button>
                      <div v-else>未上传</div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </el-card>
        <el-card shadow="hover" class="small-gap" v-else>
          <div slot="header">
            <span class="sub-title-text bold-text">已报名小组</span>
            <el-row class="content-text bold-text text-center small-gap">
              <el-col :span="6">展示次序</el-col>
              <el-col :span="6">小组序号</el-col>
              <el-col :span="6" v-if="seminarInfo.status==='已结束'">展示报告</el-col>
              <el-col :span="6" v-else>展示材料</el-col>
            </el-row>
          </div>
          <div style="height: 25vh">
            <el-scrollbar class="full-height">
              <el-table :data="attendanceList" :show-header="false" row-class-name="content-text">
                <el-table-column prop="teamOrder" align="center"></el-table-column>
                <el-table-column prop="teamNumber" align="center"></el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <div v-if="seminarInfo.status==='未开始'">
                      <div v-if="scope.row.id===attendanceID">
                        <div v-if="scope.row.pptUrl!==undefined">已上传</div>
                        <el-upload
                          v-else
                          :http-request="uploadFile"
                          :action="'/attendance/' + attendanceID + '/ppt'"
                          :multiple="false"
                          :show-file-list="false"
                          :on-success="submitSuccess"
                        >
                          <el-button plain slot="trigger" size="small">上传</el-button>
                        </el-upload>
                      </div>
                      <div v-else>
                        <div v-if="scope.row.pptUrl!==undefined">已上传</div>
                        <div v-else>未上传</div>
                      </div>
                    </div>
                    <div v-else-if="seminarInfo.status==='已结束'">
                      <el-button plain size="small" v-if="scope.row.reportUrl!==undefined">下载</el-button>
                      <div v-else>未上传</div>
                    </div>
                    <div v-else>
                      <el-button plain size="small" v-if="scope.row.pptUrl!==undefined">
                        <a :href="scope.row.pptUrl" :download="scope.row.pptName">下载</a>
                      </el-button>
                      <div v-else>未上传</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.id===undefined">
                      <div v-if="seminarInfo.status==='未开始'">
                        <el-button
                          plain
                          size="small"
                          v-if="canRegister&&attendanceID===undefined"
                          @click.native.prevent="enterAttendance"
                        >报名</el-button>
                      </div>
                    </div>
                    <div v-else-if="scope.row.id===attendanceID">
                      <div v-if="seminarInfo.status==='未开始'">
                        <el-button plain size="small" @click.native.prevent="giveUp">取消报名</el-button>
                      </div>
                      <div v-else-if="seminarInfo.status==='已结束'">
                        <el-upload
                          :http-request="uploadFile"
                          :action="'/attendance/' + attendanceID + '/report'"
                          :multiple="false"
                          :show-file-list="false"
                          :on-success="submitSuccess"
                        >
                          <el-button
                            plain
                            slot="trigger"
                            size="small"
                            v-if="scope.row.reportUrl!==undefined"
                          >重新上传</el-button>
                          <el-button plain slot="trigger" size="small" v-else>上传</el-button>
                        </el-upload>
                      </div>
                      <div v-else>
                        <el-upload
                          :http-request="uploadFile"
                          :action="'/attendance/' + attendanceID + '/report'"
                          :multiple="false"
                          :show-file-list="false"
                          :file-list="fileList"
                          :on-success="submitSuccess"
                        >
                          <el-button
                            plain
                            slot="trigger"
                            size="small"
                            v-if="scope.row.pptUrl!==undefined"
                          >重新上传</el-button>
                          <el-button plain slot="trigger" size="small" v-else>上传</el-button>
                        </el-upload>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </el-card>
        <el-dialog title="提示" :visible.sync="messageVisible" width="30vw" class="content-text">
          <span>{{message}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" plain @click.native.prevent="messageVisible = false">确定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import CommonAside from '@/components/common/CommonAside'
import TitleCard from '@/components/common/TitleCard'

export default {
  name: 'SeminarInfoPage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      seminarInfo: {
        round: undefined,
        topic: undefined,
        intro: undefined,
        status: undefined,
        order: undefined,
        teamNumLimit: undefined,
        signupStartTime: undefined,
        signupEndTime: undefined,
        reportDDL: undefined
      },
      attendanceInfo: {
        basicInfo: undefined,
        ppt: false,
        report: false
      },
      attendanceList: [],
      message: undefined,
      attendanceID: undefined,
      messageVisible: false,
      selectedClass: undefined,
      classList: undefined,
      teamID: undefined
    }
  },
  computed: {
    seminarID() {
      return this.$route.query.seminarID
    },
    classID() {
      return this.$route.query.classID
    },
    courseID() {
      return this.$route.query.courseID
    },
    modifiedTitle() {
      return '第' + this.seminarInfo.order + '次讨论课'
    },
    role() {
      return this.$store.state.role
    },
    isMobile() {
      return this.$store.state.isMobile
    },
    teamNum() {
      return this.attendanceList.filter((element, index, array) => {
        return element.id !== undefined
      }).length
    },
    signupTime() {
      return this.seminarInfo.signupStartTime + '~' + this.seminarInfo.signupEndTime
    },
    infoData() {
      return [{
        title: '轮次',
        content: '第' + this.seminarInfo.round + '轮'
      }, {
        title: '主题',
        content: this.seminarInfo.topic
      }, {
        title: '次序',
        content: '第' + this.seminarInfo.order + '次'
      }, {
        title: '要求',
        content: this.seminarInfo.intro
      }, {
        title: '课程情况',
        content: this.seminarInfo.status
      }]
    },
    timeData() {
      return [{
        title: '报名开始时间',
        content: this.seminarInfo.signupStartTime
      }, {
        title: '报名结束时间',
        content: this.seminarInfo.signupEndTime
      }]
    },
    pptData() {
      return [{
        title: '报名信息',
        content: this.attendanceInfo.basicInfo
      }, {
        title: 'PPT',
        content: this.attendanceInfo.ppt
      }]
    },
    restTime() {
      if (this.seminarInfo.reportDDL === undefined) {
        return '无相关信息'
      } else {
        let curTime = Date.parse(new Date())
        let endTime = Date.parse(new Date(this.seminarInfo.reportDDL.replace(/-/g, '/')))
        let restMs = endTime - curTime
        var days = Math.floor(restMs / (24 * 3600 * 1000))
        var leave1 = restMs % (24 * 3600 * 1000)
        var hours = Math.floor(leave1 / (3600 * 1000))
        var leave2 = leave1 % (3600 * 1000)
        var minutes = Math.floor(leave2 / (60 * 1000))
        return '剩余' + days + '天' + hours + '小时' + minutes + '分'
      }
    },
    canRegister() {
      return this.$datetimeFormat.toDate(this.seminarInfo.signupEndTime).getTime() > (new Date()).getTime()
    },
    fileData() {
      return [{
        title: '报名信息',
        content: this.attendanceInfo.basicInfo
      }, {
        title: 'PPT',
        content: this.attendanceInfo.ppt
      }, {
        title: '书面报告',
        content: this.attendanceInfo.report,
        restTime: this.restTime
      }]
    }
  },
  methods: {
    enterAttendance() {
      if (this.role === 'teacher') {
        this.$router.push({ path: '/seminar/attendance', query: { seminarID: this.seminarID, classID: this.classID } })
      } else {
        this.$router.push({ path: '/seminar/attendance', query: { seminarID: this.seminarID, classID: this.classID, teamID: this.teamID } })
      }
    },
    enterProcess() {
      if (this.role === 'teacher') {
        if (this.seminarInfo.status === '未开始') {
          this.$http.put('/seminar/' + this.seminarID + '/class/' + this.classID + '/status', { status: 1 }).then().catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        }
      }
      this.$router.push({ path: '/seminar/process', query: { seminarID: this.seminarID, classID: this.classID, courseID: this.courseID } })
    },
    setReportScore() {
      if (this.role === 'teacher') {
        this.$router.push({ path: '/seminar/score/report', query: { seminarID: this.seminarID, classID: this.classID } })
      } else {
        this.$router.push({ path: '/seminar/score/report', query: { seminarID: this.seminarID, classID: this.classID, teamID: this.teamID } })
      }
    },
    enterScore() {
      if (this.role === 'teacher') {
        this.$router.push({ path: '/seminar/score', query: { seminarID: this.seminarID, classID: this.classID } })
      } else {
        this.$router.push({ path: '/seminar/score', query: { seminarID: this.seminarID, classID: this.classID, teamID: this.teamID } })
      }
    },
    giveUp() {
      this.$http.delete('/attendance/' + this.attendanceID).then(() => {
        this.$createToast({
          time: 500,
          txt: '取消成功',
          type: "correct",
          onTimeout: () => {
            this.attendanceID = undefined
          }
        }).show()
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    },
    uploadFile(param) {
      let formData = new FormData();
      formData.append("file", param.file);
      this.$http.post(param.action, formData, {
        'Content-Type': 'multipart/form-data'
      }).then(res => {
        if (res.message === 'fail to upload') {
          this.$createToast({
            time: 500,
            txt: '文件上传失败',
            type: "error"
          }).show()
          param.onError('文件上传失败(' + response.message + ')');
        } else {
          if (param.action.match('ppt')) {
            param.onSuccess('ppt')
          } else if (param.action.match('report')) {
            param.onSuccess('report')
          }
        }
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: '文件上传失败:' + error.response.data,
          type: "error"
        }).show()
        if (error.response) {
          param.onError('文件上传失败(' + error.response.status + ')，' + error.response.data);
        } else if (error.request) {
          param.onError('文件上传失败，服务器端无响应');
        } else {
          param.onError('文件上传失败，请求封装失败');
        }
      })
    },
    submitSuccess(type) {
      if (this.isMobile) {
        this.$createToast({
          time: 500,
          txt: '提交成功',
          type: 'correct',
          onTimeout: () => {
            if (type === 'ppt') {
              this.attendanceInfo.ppt = true
            } else if (type === 'report') {
              this.attendanceInfo.report = true
            }
          }
        }).show()
      } else {
        this.message = '提交成功！'
        this.messageVisible = true
      }
    },
    getAttendance() {
      this.attendanceList = []
      this.$http.get('/seminar/' + this.seminarID + '/class/' + this.selectedClass + '/attendance').then(response => {
        response.forEach((item, index, array) => {
          this.$http.get('/attendance/' + item.id + '/ppt').then(res => {
            this.$http.get('/attendance/' + item.id + '/report').then(report => {
              this.attendanceList.push({
                id: item.id,
                teamOrder: item.teamOrder,
                teamNumber: item.teamNumber,
                pptName: res.name === null ? undefined : res.name,
                pptUrl: res.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/ppt/' + res.url,
                reportName: report.name === null ? undefined : report.name,
                reportUrl: report.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/report/' + report.url
              })
              if (this.attendanceList.length === response.length) {
                let tempList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
                tempList.forEach((item, index, arr) => {

                })
                let curIndex = 1
                tempList.forEach(item => {
                  while (item.teamOrder > curIndex) {
                    this.attendanceList.push({
                      id: undefined,
                      teamOrder: curIndex,
                      teamNumber: undefined,
                      pptName: undefined,
                      pptUrl: undefined
                    })
                    curIndex++
                  }
                  curIndex++
                })
                while (curIndex < this.teamLimit) {
                  this.attendanceList.push({
                    id: undefined,
                    teamOrder: curIndex,
                    teamNumber: undefined,
                    pptName: undefined,
                    pptUrl: undefined
                  })
                  curIndex++
                }
                this.attendanceList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
              }
            }).catch(error => {
              this.$createToast({
                time: 500,
                txt: error.message,
                type: "error"
              }).show()
            })
          }).catch(error => {
            this.$createToast({
              time: 500,
              txt: error.message,
              type: "error"
            }).show()
          })
        })

        if (response.length === 0) {
          for (var i = 0; i < this.teamLimit; i++) {
            this.attendanceList.push({
              id: undefined,
              teamOrder: i,
              teamNumber: undefined,
              pptName: undefined,
              pptUrl: undefined
            })
          }
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
    if (this.isMobile) {
      if (this.role === 'student') {
        this.$http.get('/course/' + this.courseID + '/myTeam').then(response => {
          this.teamID = response.id
          if (this.teamID === undefined) {
            this.$createToast({
              time: 500,
              txt: '您还未组队',
              type: "error",
              onTimeout: () => {
                this.$router.back()
              }
            }).show()
          } else {
            this.$http.get('/seminar/' + this.seminarID + '/team/' + this.teamID + '/attendance').then(res => {
              this.attendanceID = res.id
              this.attendanceInfo.basicInfo = res.teamNumber + '(' + res.teamOrder + ')'
              this.attendanceInfo.ppt = res.pptUrl ? true : false
              this.attendanceInfo.report = res.reportUrl ? true : false
            }).catch(error => {
              this.$createToast({
                time: 500,
                txt: error.message,
                type: "error"
              }).show()
            })
          }
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      }
      this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID).then(response => {
        this.seminarInfo.topic = response.topic
        this.seminarInfo.round = response.round
        this.seminarInfo.intro = response.intro
        this.seminarInfo.order = response.order
        this.seminarInfo.teamNumLimit = response.teamNumLimit
        this.seminarInfo.signupStartTime = response.signUpStartTime ? this.$datetimeFormat.toPretty(response.signUpStartTime) : undefined
        this.seminarInfo.signupEndTime = response.signUpEndTime ? this.$datetimeFormat.toPretty(response.signUpEndTime) : undefined
        this.seminarInfo.reportDDL = response.reportDDL ? this.$datetimeFormat.toPretty(response.reportDDL) : undefined
        let status = response.status
        if (status === 0) {
          this.seminarInfo.status = "未开始"
        } else if (status === 1) {
          this.seminarInfo.status = "正在进行"
        } else if (response.reportDDL === undefined || (new Date()).getTime() < this.$datetimeFormat.toDate(response.reportDDL).getTime()) {
          this.seminarInfo.status = "已结束"
        } else {
          this.seminarInfo.status = "已截止"
        }
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
    } else {
      this.$http.get('/seminar/' + this.seminarID).then(response => {
        this.seminarInfo.topic = response.topic
        this.seminarInfo.round = response.round
        this.seminarInfo.intro = response.intro
        this.seminarInfo.order = response.order
        this.seminarInfo.teamNumLimit = response.teamNumLimit
        this.seminarInfo.signupStartTime = response.signUpStartTime ? this.$datetimeFormat.toPretty(response.signUpStartTime) : undefined
        this.seminarInfo.signupEndTime = response.signUpEndTime ? this.$datetimeFormat.toPretty(response.signUpEndTime) : undefined
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
      this.$http.get('/seminar/' + this.seminarID + '/class').then(response => {
        this.classList = response
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: error.message,
          type: "error"
        }).show()
      })
      if (this.role === 'student') {
        this.attendanceList = []
        this.$http.get('/seminar/' + this.seminarID + '/class/' + this.classID + '/attendance').then(response => {
          response.forEach((item, index, array) => {
            this.$http.get('/attendance/' + item.id + '/ppt').then(res => {
              this.$http.get('/attendance/' + item.id + '/report').then(report => {
                this.attendanceList.push({
                  id: item.id,
                  teamOrder: item.teamOrder,
                  teamNumber: item.teamNumber,
                  pptName: res.name === null ? undefined : res.name,
                  pptUrl: res.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/ppt/' + res.url,
                  reportName: report.name === null ? undefined : report.name,
                  reportUrl: report.url === null ? undefined : 'http://47.107.69.160:8080/download/attendance/' + item.id + '/ppt/' + report.url
                })
                if (this.attendanceList.length === response.length) {
                  let tempList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
                  tempList.forEach((item, index, arr) => {

                  })
                  let curIndex = 1
                  tempList.forEach(item => {
                    while (item.teamOrder > curIndex) {
                      this.attendanceList.push({
                        id: undefined,
                        teamOrder: curIndex,
                        teamNumber: undefined,
                        pptName: undefined,
                        pptUrl: undefined
                      })
                      curIndex++
                    }
                    curIndex++
                  })
                  while (curIndex < this.teamLimit) {
                    this.attendanceList.push({
                      id: undefined,
                      teamOrder: curIndex,
                      teamNumber: undefined,
                      pptName: undefined,
                      pptUrl: undefined
                    })
                    curIndex++
                  }
                  this.attendanceList = this.attendanceList.sort((a, b) => a.teamOrder - b.teamOrder)
                }
              }).catch(error => {
                this.$createToast({
                  time: 500,
                  txt: error.message,
                  type: "error"
                }).show()
              })
            }).catch(error => {
              this.$createToast({
                time: 500,
                txt: error.message,
                type: "error"
              }).show()
            })
          })
          if (response.length === 0) {
            for (var i = 0; i < this.teamLimit; i++) {
              this.attendanceList.push({
                id: undefined,
                teamOrder: i,
                teamNumber: undefined,
                pptName: undefined,
                pptUrl: undefined
              })
            }
          }
        }).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: "error"
          }).show()
        })
      }
    }
  }
}
</script>
