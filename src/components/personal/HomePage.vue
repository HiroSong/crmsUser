<template>
  <div>
    <el-container>
      <el-header class="header">
        <common-header :role="role" :is-mobile="true"></common-header>
      </el-header>
      <el-main class="main-gap">
        <el-row>
          <div class="personal-info sub-title-text">欢迎，{{name}}</div>
        </el-row>
        <el-row>
          <div class="personal-info content-text small-gap">{{username}}</div>
        </el-row>
        <div class="item-menu">
          <el-row class="normal-gap">
            <router-link to="/course" class="no-decoration">
              <el-card shadow="hover" class="content-text">我的课程</el-card>
            </router-link>
          </el-row>
          <el-row class="small-gap">
            <router-link to="/account" class="no-decoration">
              <el-card shadow="hover" class="content-text">账户与设置</el-card>
            </router-link>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'

export default {
  name: 'HomePage',
  components: {
    'common-header': CommonHeader
  },
  data() {
    return {
      name: undefined,
      username: undefined
    }
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  created() {
    this.$http.get('/user/information').then(response => {
      this.name = response.name
      this.username = response.username
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

<style scope>
.personal-info {
  text-align: right;
}
</style>
