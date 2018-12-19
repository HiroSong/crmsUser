<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName+'-讨论课'}}</common-sub-header>
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
                class="orange-text full-text"
                @click.native.prevent="enterProcess"
              >进入讨论课</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='暂停计时'">
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-text"
                @click.native.prevent="continueSeminar"
              >继续讨论课</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='未开始'">
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-text"
                @click.native.prevent="enterProcess"
              >开始讨论课</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='已完成'">
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-text"
                @click.native.prevent="setReportScore"
              >书面报告评分</el-button>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button plain class="orange-text full-text" @click.native.prevent="enterScore">查看成绩</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <div v-if="seminarInfo.status==='正在进行'||seminarInfo.status==='暂停计时'">
          <el-row type="flex" justify="center" class="normal-gap">
            <el-col :span="12">
              <el-button
                plain
                class="orange-text full-text"
                @click.native.prevent="enterProcess"
              >进入讨论课</el-button>
            </el-col>
          </el-row>
          <el-row v-if="attendanceId!==undefined" type="flex" justify="center" class="small-gap">
            <el-col :span="12">
              <el-button plain class="orange-text full-text" @click.native.prevent="submitPPT">PPT提交</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="seminarInfo.status==='未开始'">
          <div v-if="attendanceId!==undefined">
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
                <el-button
                  plain
                  class="orange-text full-text"
                  @click.native.prevent="submitPPT"
                >PPT提交</el-button>
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
            <el-row type="flex" justify="center" class="small-gap">
              <el-col :span="12">
                <el-button
                  plain
                  class="orange-text full-text"
                  @click.native.prevent="enterAttendance"
                >报名</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else-if="seminarInfo.status==='已完成'">
          <div v-if="attendanceId!==undefined">
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
                <el-button
                  plain
                  class="orange-text full-text"
                  @click.native.prevent="submitReport"
                >书面报告提交</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else-if="seminarInfo.status==='已截止'">
          <div v-if="attendanceId!==undefined">
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
            <el-row type="flex" justify="center" class="small-gap">
              <el-col :span="12">
                <el-button
                  plain
                  class="orange-text full-text"
                  @click.native.prevent="enterScore"
                >查看成绩</el-button>
              </el-col>
            </el-row>
          </div>
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
        <common-aside :role="role"></common-aside>
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
                      v-model="round"
                      placeholder="请选择班级"
                      class="content-text"
                      size="medium"
                      no-data-text="暂时没有班级可选"
                    >
                      <el-option value="1" label="2016(1)" class="content-text"></el-option>
                      <el-option value="2" label="2016(2)" class="content-text"></el-option>
                      <el-option value="3" label="2016(3)" class="content-text"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row class="content-text bold-text text-center small-gap">
              <el-col :span="6">展示次序</el-col>
              <el-col :span="6">小组序号</el-col>
              <el-col :span="6">组长</el-col>
              <el-col :span="6" v-if="seminarInfo.status==='已结束'">展示报告</el-col>
              <el-col :span="6" v-else>展示材料</el-col>
            </el-row>
          </div>
          <div style="height: 20vh">
            <el-scrollbar class="full-height">
              <el-table :data="teamList" :show-header="false" row-class-name="content-text">
                <el-table-column prop="order" align="center"></el-table-column>
                <el-table-column prop="name" align="center"></el-table-column>
                <el-table-column prop="leader" align="center"></el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <div v-if="seminarInfo.status==='未开始'">
                      <div v-if="scope.row.pptStatus===true">已上传</div>
                      <div v-else-if="scope.row.pptStatus===false">未上传</div>
                    </div>
                    <div v-else-if="seminarInfo.status==='已结束'">
                      <el-button plain size="small" v-if="scope.row.reportStatus===true">下载</el-button>
                      <div v-else-if="scope.row.reportStatus===false">未上传</div>
                    </div>
                    <div v-else>
                      <el-button plain size="small" v-if="scope.row.pptStatus===true">下载</el-button>
                      <div v-else-if="scope.row.pptStatus===false">未上传</div>
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
              <el-col :span="5">展示次序</el-col>
              <el-col :span="5">小组序号</el-col>
              <el-col :span="5">组长</el-col>
              <el-col :span="5" v-if="seminarInfo.status==='已结束'">展示报告</el-col>
              <el-col :span="5" v-else>展示材料</el-col>
            </el-row>
          </div>
          <div style="height: 20vh">
            <el-scrollbar class="full-height">
              <el-table :data="teamList" :show-header="false" row-class-name="content-text">
                <el-table-column prop="order" min-width="20.83%" align="center"></el-table-column>
                <el-table-column prop="name" min-width="20.83%" align="center"></el-table-column>
                <el-table-column prop="leader" min-width="20.83%" align="center"></el-table-column>
                <el-table-column min-width="20.83%" align="center">
                  <template slot-scope="scope">
                    <div v-if="seminarInfo.status==='未开始'">
                      <div v-if="scope.row.id===attendanceId">
                        <div v-if="scope.row.pptStatus===true">已上传</div>
                        <el-upload
                          ref="upload"
                          action="上传地址"
                          v-else-if="scope.row.pptStatus===false"
                          :limit="1"
                          :multiple="false"
                        >
                          <el-button plain slot="trigger" size="small">上传</el-button>
                        </el-upload>
                      </div>
                      <div v-else>
                        <div v-if="scope.row.pptStatus===true">已上传</div>
                        <div v-else-if="scope.row.pptStatus===false">未上传</div>
                      </div>
                    </div>
                    <div v-else-if="seminarInfo.status==='已结束'">
                      <el-button plain size="small" v-if="scope.row.reportStatus===true">下载</el-button>
                      <div v-else-if="scope.row.reportStatus===false">未上传</div>
                    </div>
                    <div v-else>
                      <el-button plain size="small" v-if="scope.row.pptStatus===true">下载</el-button>
                      <div v-else-if="scope.row.pptStatus===false">未上传</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="16.68%" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.id===undefined">
                      <div v-if="seminarInfo.status==='未开始'">
                        <el-button plain size="small" v-if="attendanceId===undefined">报名</el-button>
                      </div>
                    </div>
                    <div v-else-if="scope.row.id===attendanceId">
                      <div v-if="seminarInfo.status==='未开始'">
                        <el-button plain size="small">取消报名</el-button>
                      </div>
                      <div v-else-if="seminarInfo.status==='已结束'">
                        <el-button plain size="small" v-if="scope.row.reportStatus===true">重新上传</el-button>
                        <el-upload
                          ref="upload"
                          action="上传地址"
                          v-else-if="scope.row.reportStatus===false"
                          :limit="1"
                          :multiple="false"
                        >
                          <el-button plain slot="trigger" size="small">上传</el-button>
                        </el-upload>
                      </div>
                      <div v-else>
                        <el-upload
                          ref="upload"
                          action="上传地址"
                          v-if="scope.row.pptStatus===true"
                          :limit="1"
                          :multiple="false"
                        >
                          <el-button plain slot="trigger" size="small">重新上传</el-button>
                        </el-upload>
                        <el-upload
                          ref="upload"
                          action="上传地址"
                          v-else-if="scope.row.pptStatus===false"
                          :limit="1"
                          :multiple="false"
                        >
                          <el-button plain slot="trigger" size="small">上传</el-button>
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
        round: 1,
        id: undefined,
        topic: '需求分析',
        intro: undefined,
        status: '已完成',
        order: 1,
        courseId: undefined,
        teamNumLimit: 6,
        signupStartTime: '2018-01-01 08:00:00',
        signupEndTime: '2018-01-10 12:00:00',
        reportDDL: '2018-12-29 00:00:00',
        classId: undefined
      },
      teamList: [{
        id: 1,
        order: 1,
        name: '1-1',
        leader: 'A',
        pptStatus: true,
        reportStatus: true
      }, {
        id: 2,
        order: 2,
        name: '1-2',
        leader: 'B',
        pptStatus: false,
        reportStatus: false
      }, {
        id: 3,
        order: 3,
        name: '1-3',
        leader: 'C',
        pptStatus: true,
        reportStatus: true
      }, {
        id: undefined,
        order: undefined,
        name: undefined,
        leader: undefined,
        pptStatus: undefined,
        reportStatus: undefined
      }],
      courseName: 'OOAD',
      message: undefined,
      attendanceId: 3,
      messageVisible: false
    }
  },
  computed: {
    modifiedTitle() {
      return this.courseName + '-' + this.seminarInfo.topic
    },
    role() {
      return this.$store.state.role
    },
    isMobile() {
      return this.$store.state.isMobile
    },
    teamNum() {
      return this.teamList.filter((element, index, array) => {
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
        // 记得添加
        content: '队伍报名信息'
      }, {
        title: 'PPT',
        content: false
      }]
    },
    restTime() {
      let curTime = Date.parse(new Date())
      let endTime = Date.parse(new Date(this.seminarInfo.reportDDL.replace(/-/g, '/')))
      let restMs = endTime - curTime
      var days = Math.floor(restMs / (24 * 3600 * 1000))
      var leave1 = restMs % (24 * 3600 * 1000)
      var hours = Math.floor(leave1 / (3600 * 1000))
      var leave2 = leave1 % (3600 * 1000)
      var minutes = Math.floor(leave2 / (60 * 1000))
      return '剩余' + days + '天' + hours + '小时' + minutes + '分'
    },
    fileData() {
      return [{
        title: '报名信息',
        // 记得添加
        content: '队伍报名信息'
      }, {
        title: 'PPT',
        content: true
      }, {
        title: '书面报告',
        content: false,
        restTime: this.restTime
      }]
    }
  },
  methods: {
    enterAttendance() {
      this.$router.push('/seminar/attendance')
    },
    continueSeminar() {

      this.$router.push('/seminar/process')
    },
    enterProcess() {
      this.$router.push('/seminar/process')
    },
    setReportScore() {
      this.$router.push('/seminar/score/report')
    },
    enterScore() {
      this.$router.push('/seminar/score')
    },
    submitPPT() {

    },
    submitReport() {

    }
  }
}
</script>
