<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">新建班级</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-row>
        <div class="content-text">班级名</div>
      </el-row>
      <cube-validator :model="classInfo.grade" :rules="{ required: true}" v-model="gradeValid">
        <cube-input
          v-model="classInfo.grade"
          placeholder="年级"
          class="small-gap content-text"
          :autofocus="true"
        ></cube-input>
      </cube-validator>
      <cube-validator
        :model="classInfo.klassSerial"
        :rules="{ required: true}"
        v-model="klassSerialValid"
      >
        <cube-input v-model="classInfo.klassSerial" placeholder="班级" class="content-text small-gap"></cube-input>
      </cube-validator>
      <cube-form :model="classInfo" :schema="schemaClass" class="content-text"></cube-form>
      <el-row class="small-gap">
        <el-col :span="12">
          <div class="content-text">学生名单</div>
        </el-col>
        <el-col :span="12">
          <el-upload
            ref="uploadExcelForCreate"
            :http-request="uploadStudent"
            action
            :multiple="false"
            :file-list="fileList"
            :on-success="submitSuccess"
            :auto-upload="false"
          >
            <el-button plain class="orange-text" slot="trigger" size="mini">选择文件</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="createClass">创建</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'CreateClassPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      classInfo: {
        grade: undefined,
        klassSerial: undefined,
        klassTime: undefined,
        klassLocation: undefined
      },
      classID: undefined,
      fileList: [],
      gradeValid: undefined,
      klassSerialValid: undefined,
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile
    },
    courseID() {
      return this.$route.query.courseID
    },
    schemaClass() {
      return {
        fields: [{
          type: 'input',
          modelKey: 'klassTime',
          label: '上课时间',
          props: {
            placeholder: '请输入',
            autoExpand: true
          }
        }, {
          type: 'input',
          modelKey: 'klassLocation',
          label: '上课地点',
          props: {
            placeholder: '请输入',
            autoExpand: true
          }
        }]
      }
    }
  },
  methods: {
    uploadStudent(param) {
      if (param === undefined) {
        this.submitSuccess()
        return
      }
      let formData = new FormData();
      formData.append("file", param.file);
      this.$http.post('/class/' + this.classID + '/student', formData, {
        'Content-Type': 'multipart/form-data'
      }).then(res => {
        param.onSuccess()
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
      this.$createToast({
        time: 500,
        txt: '创建成功',
        type: 'correct',
        onTimeout: () => {
          this.$router.back()
        }
      }).show()
    },
    createClass() {
      if (!this.gradeValid || !this.klassSerialValid)
        return
      this.classInfo.klassTime = this.classInfo.klassTime === undefined ? '' : this.classInfo.klassTime
      this.classInfo.klassLocation = this.classInfo.klassLocation === undefined ? '' : this.classInfo.klassLocation
      this.$http.post('/course/' + this.courseID + '/class', this.classInfo).then(response => {
        this.classID = response.klassID
        this.$refs.uploadExcelForCreate.submit()
        if (this.fileList.length === 0) {
          this.submitSuccess()
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
</script>
