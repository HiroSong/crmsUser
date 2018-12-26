<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">账户与设置</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-table
        v-if="role==='teacher'"
        :data="personalTeacherInfo"
        :show-header="false"
        row-class-name="content-text"
      >
        <el-table-column prop="name" min-width="40%" align="left"></el-table-column>
        <el-table-column min-width="60%" align="left">
          <template slot-scope="scope">
            <el-row type="flex" justify="start">
              <el-col v-if="scope.row.value!==undefined" :span="19">
                <div>{{scope.row.value}}</div>
              </el-col>
              <el-col v-if="scope.row.name==='联系方式'" :span="5">
                <router-link to="/account/email">
                  <a class="tip-text">修改</a>
                </router-link>
              </el-col>
              <el-col :span="5" v-else-if="scope.row.name==='账户密码'">
                <router-link to="/account/password">
                  <i class="el-icon-arrow-right"></i>
                </router-link>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="personalStudentInfo"
        :show-header="false"
        row-class-name="content-text"
      >
        <el-table-column prop="name" min-width="40%" align="left"></el-table-column>
        <el-table-column min-width="60%" align="left">
          <template slot-scope="scope">
            <el-row type="flex" justify="start">
              <el-col v-if="scope.row.value!==undefined" :span="19">
                <div>{{scope.row.value}}</div>
              </el-col>
              <el-col v-if="scope.row.name==='联系方式'" :span="5">
                <router-link to="/account/email">
                  <a class="tip-text">修改</a>
                </router-link>
              </el-col>
              <el-col v-else-if="scope.row.name==='账户密码'" :span="5">
                <router-link to="/account/password">
                  <i class="el-icon-arrow-right"></i>
                </router-link>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button type="danger" plain class="full-width" @click.native.prevent="logOut">退出登录</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>


<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'AccountPage',
  data() {
    return {
      personalTeacherInfo: [{
        name: '姓名',
        value: undefined
      }, {
        name: '教工号',
        value: undefined
      }, {
        name: '联系方式',
        value: undefined
      }, {
        name: '账户密码',
        value: undefined
      }, {
        name: '管理员邮箱',
        value: 'icecream.song@qq.com'
      }],
      personalStudentInfo: [{
        name: '姓名',
        value: undefined
      }, {
        name: '学号',
        value: undefined
      }, {
        name: '联系方式',
        value: undefined
      }, {
        name: '账户密码',
        value: undefined
      }, {
        name: '管理员邮箱',
        value: 'icecream.song@qq.com'
      }]
    }
  },
  components: {
    'common-sub-header': CommonSubHeader
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    logOut() {
      this.$router.push('/login')
    }
  },
  activated() {
    this.$http.get('/user/information').then(response => {
      if (this.role === 'teacher') {
        this.personalTeacherInfo[0].value = response.name
        this.personalTeacherInfo[1].value = response.username
        this.personalTeacherInfo[2].value = response.email
      } else {
        this.personalStudentInfo[0].value = response.name
        this.personalStudentInfo[1].value = response.username
        this.personalStudentInfo[2].value = response.email
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
</script>