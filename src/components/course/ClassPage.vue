<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">班级信息</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <div v-for="(item,index) in classList" :key="index">
        <el-row>
          <div class="text-center content-text">{{item.name}}</div>
        </el-row>
        <el-row class="small-gap" type="flex" justify="center">
          <el-col class="text-start content-text">讨论课时间</el-col>
          <el-col class="text-start content-text">{{item.time}}</el-col>
        </el-row>
        <el-row class="small-gap" type="flex" justify="center">
          <el-col class="text-start content-text">讨论课地点</el-col>
          <el-col class="text-start content-text">{{item.classroom}}</el-col>
        </el-row>
        <el-row class="small-gap" type="flex" justify="center">
          <el-col :span="8">
            <el-upload
              :http-request="uploadStudent"
              :action="'/class/' + item.id + '/student'"
              :limit="1"
              :multiple="false"
              :show-file-list="false"
              :file-list="fileList"
              :on-success="submitSuccess"
            >
              <el-button size="small" class="orange-text full-width">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-button
              size="small"
              type="danger"
              plain
              class="full-width"
              @click.native.prevent="deleteClass(item.id)"
            >删除班级</el-button>
          </el-col>
        </el-row>
        <div class="small-gap"></div>
      </div>
      <el-row class="normal-gap" type="flex" justify="center">
        <el-col :span="12">
          <router-link
            :to="{path: '/course/class/create', query:{courseID: this.courseID}}"
            class="no-decoration"
          >
            <el-button class="orange-text full-width">新增班级</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-sub-header role="teacher"></common-sub-header>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <common-aside role="teacher"></common-aside>
      </el-aside>
      <el-main class="main-gap">
        <title-card>{{modifiedTitle}}</title-card>
        <el-card shadow="hover" class="normal-gap">
          <div slot="header">
            <span class="title-text">班级列表</span>
          </div>
          <div style="height: 55vh">
            <el-scrollbar class="full-height">
              <el-row type="flex" justify="center">
                <el-col :span="22">
                  <el-table :data="classList" row-class-name="content-text" :show-header="false">
                    <el-table-column prop="name" align="center"></el-table-column>
                    <el-table-column align="center">
                      <template slot-scope="scope">
                        <el-upload
                          :http-request="uploadStudent"
                          :action="'/class/' + scope.row.id + '/student'"
                          :multiple="false"
                          :show-file-list="false"
                          :file-list="fileList"
                          :on-success="submitSuccess"
                        >
                          <el-button type="primary" slot="trigger" size="small">上传</el-button>
                        </el-upload>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
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
import { error } from 'util';

export default {
  name: 'ClassPage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      classList: undefined,
      courseName: undefined,
      message: undefined,
      messageVisible: false,
      fileList: []
    }
  },
  computed: {
    courseID() {
      return this.$route.query.courseID
    },
    modifiedTitle() {
      return this.courseName + '-导入学生名单'
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  methods: {
    uploadStudent(param) {
      let formData = new FormData();
      formData.append("file", param.file);
      this.$http.post(param.action, formData, {
        'Content-Type': 'multipart/form-data'
      }).then(res => {
        if (res.message === '插入成功') {
          param.onSuccess()
        } else {
          param.onError('文件上传失败(' + response.message + ')');
        }
      }).catch(error => {
        if (error.response) {
          param.onError('文件上传失败(' + error.response.status + ')，' + error.response.data);
        } else if (error.request) {
          param.onError('文件上传失败，服务器端无响应');
        } else {
          param.onError('文件上传失败，请求封装失败');
        }
      })
    },
    submitSuccess() {
      if (this.isMobile) {
        this.$createToast({
          time: 500,
          txt: '提交成功',
          type: 'correct'
        }).show()
      } else {
        this.message = '提交成功！'
        this.messageVisible = true
      }
    },
    deleteClass(id) {
      this.$createDialog({
        type: 'confirm',
        title: '警告',
        content: '确定删除该班级吗？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        cancelBtn: {
          text: '放弃',
          active: false,
          disabled: false
        },
        onConfirm: () => {
          this.$http.delete('/class/' + id).then(() => {
            this.$http.get('/course/' + this.courseID + '/class').then(response => {
              this.classList = response
              this.$createToast({
                time: 500,
                txt: "删除成功",
                type: "correct"
              }).show()
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
        }
      }).show()
    }
  },
  created() {
    this.$http.get('/course/' + this.courseID + '/class').then(response => {
      this.classList = response
    }).catch(error => {
      this.$createToast({
        time: 500,
        txt: error.message,
        type: "error"
      }).show()
    })
    if (!this.isMobile) {
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
}
</script>
