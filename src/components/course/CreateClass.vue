<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="isMobile">新建班级</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <!-- 记得绑定变量 -->
      <el-row>
        <div class="content-text">班级名</div>
      </el-row>
      <cube-input v-model="grade" placeholder="年级" class="small-gap content-text"></cube-input>
      <cube-input v-model="order" placeholder="班级" class="content-text"></cube-input>
      <cube-form :model="classInfo" :schema="schemaClass" class="content-text"></cube-form>
      <el-row class="small-gap">
        <el-col :span="12">
          <div class="content-text">学生名单</div>
        </el-col>
        <el-col :span="12">
          <div v-if="file" class="content-text">{{file}}</div>
          <div v-else class="tip-text">暂无文件</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" class="small-gap">
        <el-col :span="12">
          <el-upload
            ref="uploadStudentFile"
            action="上传地址"
            :limit="1"
            :multiple="false"
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
  data: function () {
    return {
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile
    },
    schemaClass() {
      return {
        fields: [{
          type: 'textarea',
          modelKey: 'time',
          label: '上课时间',
          props: {
            placeholder: '请输入',
            autoExpand: true
          },
          rules: {
            required: true
          }
        }, {
          type: 'textarea',
          modelKey: 'address',
          label: '上课地点',
          props: {
            placeholder: '请输入',
            autoExpand: true
          },
          rules: {
            required: true
          }
        }]
      }
    }
  },
  methods: {
    createClass() {
      this.$refs.uploadStudentFile.submit()

      this.$createToast({
        time: 500,
        txt: '创建成功',
        type: 'correct',
        onTimeout: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
