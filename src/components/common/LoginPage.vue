<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <login-header :is-mobile="true"></login-header>
    </el-header>
    <el-main class="main-gap">
      <cube-input
        v-model="form.username"
        placeholder="请输入学号/教工号"
        type="text"
        :autofocus="true"
        :autocomplete="true"
        :clearable="true"
        class="normal-gap"
      ></cube-input>
      <cube-input
        v-model="form.password"
        placeholder="请输入密码"
        type="password"
        :autocomplete="true"
        :clearable="true"
        :eye="{open:false, reverse:false}"
        class="normal-gap"
      ></cube-input>
      <el-row type="flex" justify="end" class="small-gap">
        <div class="tip-text">* 初次登录默认密码为 123456</div>
      </el-row>
      <el-row type="flex" justify="end" class="small-gap">
        <router-link to="/find">
          <a class="tip-text">忘记密码</a>
        </router-link>
      </el-row>
      <el-row type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="login">登录</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <login-header></login-header>
    </el-header>
    <el-main class="top">
      <el-row type="flex" justify="center">
        <div class="title-text bold-text">翻转课堂登录</div>
      </el-row>
      <el-form ref="form" :model="form">
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="5">
            <el-form-item>
              <el-input
                class="content-text"
                placeholder="请输入学号/教工号"
                :clearable="true"
                v-model="form.username"
                autocomplete="on"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="5">
            <el-form-item>
              <el-input
                class="content-text"
                placeholder="请输入密码"
                type="password"
                :clearable="true"
                v-model="form.password"
                autocomplete="on"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="normal-gap">
          <el-col :span="2">
            <el-form-item>
              <el-button
                class="full-width text-center"
                type="primary"
                @click.native.prevent="login"
              >登录</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog title="提示" :visible.sync="dialogVisible" class="content-text">
        <span>{{dialogMessage}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native.prevent="dialogVisible = false">确定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import LoginHeader from '@/components/common/LoginHeader'

export default {
  name: 'LoginPage',
  components: {
    'login-header': LoginHeader
  },
  data() {
    return {
      form: {
        username: undefined,
        password: undefined
      },
      dialogVisible: false,
      dialogMessage: undefined
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  methods: {
    login() {
      // this.$http.post('/login',
      //   {
      //     number: this.form.username,
      //     password: this.form.password
      //   }).then(response => {
      //     this.$store.commit('SET_AUTH', response)
      //     this.$router.push({ path: '/teachers' })
      //   }).catch(error => {
      //     this.dialogMessage = error.message
      //     this.dialogVisible = true
      //   })
      if (this.isMobile) {
        this.$router.push({ path: '/home' })
      }
      else {
        this.$router.push({ path: '/course' })
      }
    }
  }
};
</script>