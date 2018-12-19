<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">班级信息</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <!--此处应该改成table形式显示-->
      <el-row>
        <div class="text-center content-text">2016-1</div>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
        <el-col class="text-center content-text">讨论课时间</el-col>
        <el-col class="text-center content-text">周三7、8节</el-col>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
        <el-col class="text-center content-text">讨论课地点</el-col>
        <el-col class="text-center content-text">海韵教学楼</el-col>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
        <el-col class="text-center content-text">课程学生名单</el-col>
        <el-col class="text-center content-text">周三56节.xlsx</el-col>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
        <el-button size="small" class="orange-text">选择文件</el-button>
      </el-row>
      <el-row class="small-gap" type="flex" justify="center">
        <el-button size="small" class="orange-text">删除班级</el-button>
      </el-row>
      <el-row class="normal-gap" type="flex" justify="center">
        <router-link to="/course/class/create" class="no-decoration">
          <el-button size="medium" class="orange-text">新增班级</el-button>
        </router-link>
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
                  <el-table :data="tableData" row-class-name="content-text" :show-header="false">
                    <el-table-column prop="name" align="center"></el-table-column>
                    <el-table-column align="center">
                      <template slot-scope="scope">
                        <el-upload
                          ref="uploadStudent"
                          action="上传地址"
                          v-if="scope.row.file===undefined"
                          :limit="1"
                          :multiple="false"
                          :auto-upload="false"
                        >
                          <el-button type="primary" slot="trigger" size="small">选择文件</el-button>
                        </el-upload>
                        <el-button
                          v-else
                          type="text"
                          size="small"
                          style="color:#606266"
                          @click.native.prevent="getFile"
                        >{{scope.row.file.name}}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" align="center">
                      <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                          <el-button
                            plain
                            type="primary"
                            size="small"
                            @click.native.prevent="submitFile"
                          >提交</el-button>
                          <el-button plain size="small" @click.native.prevent="resetFile">重置</el-button>
                        </el-row>
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

export default {
  name: 'ClassPage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      tableData: [{
        name: '1班',
        file: {
          name: '2016_1.xlsx',
          url: ''
        }
      }, {
        name: '2班',
        file: undefined
      }],
      courseName: undefined,
      message: undefined,
      messageVisible: false
    }
  },
  computed: {
    modifiedTitle() {
      return this.courseName + '-导入学生名单'
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  methods: {
    getFile() {

    },
    submitFile() {
      // ajax请求
      this.$refs.uploadStudent.submit()
      this.message = '提交成功！'
      this.messageVisible = true
    },
    resetFile() {
      // ajax请求
      this.message = '学生名单已重置！'
      this.messageVisible = true
    }
  }
}
</script>
