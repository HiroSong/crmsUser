<template>
  <el-container>
    <el-header class="header">
      <login-sub-header>找回密码</login-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-input
        v-model="username"
        placeholder="请输入学号/教工号"
        type="text"
        :autofocus="true"
        :autocomplete="true"
        :clearable="true"
        class="normal-gap"
      ></cube-input>
      <el-row type="flex" justify="center" class="top">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="findPassword">确认</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import LoginSubHeader from '@/components/common/LoginSubHeader'

export default {
  name: 'FindPasswordPage',
  components: {
    'login-sub-header': LoginSubHeader
  },
  data() {
    return {
      username: undefined
    }
  },
  methods: {
    findPassword() {
      this.$http.get('/user/' + this.username + '/password').then(() => {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '密码已发送至邮箱,请注意查收',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false
          },
          onConfirm: () => {
            this.$router.back()
          }
        }).show()
      }).catch(error => {
        this.$createToast({
          time: 500,
          txt: '您可能还未激活账户',
          type: "error"
        }).show()
      })
    }
  }
}
</script>
