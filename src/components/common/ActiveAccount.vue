<template>
  <el-container>
    <el-header class="header">
      <login-sub-header>激活账户</login-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-input
        v-model="password"
        placeholder="请输入新密码"
        type="password"
        :autofocus="true"
        :autocomplete="true"
        :clearable="true"
        :eye="{open:false, reverse:false}"
        class="normal-gap"
      ></cube-input>
      <el-row type="flex" justify="end" class="small-gap">
        <div class="tip-text">* 可包含数字、字母、下划线，长度不小于6位</div>
      </el-row>
      <cube-input
        v-model="passwordConfirm"
        placeholder="请再次输入密码"
        type="password"
        :autocomplete="true"
        :clearable="true"
        :eye="{open:false, reverse:false}"
        class="normal-gap"
      ></cube-input>
      <div v-if="role==='student'">
        <cube-input
          v-model="email"
          placeholder="请输入邮箱"
          type="text"
          :autocomplete="true"
          :clearable="true"
          class="normal-gap"
        ></cube-input>
      </div>
      <el-row type="flex" justify="center" class="normal-gap">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="active">确认</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import LoginSubHeader from '@/components/common/LoginSubHeader'

export default {
  name: 'ActiveAccountPage',
  data() {
    return {
      password: undefined,
      passwordConfirm: undefined,
      email: undefined
    }
  },
  components: {
    'login-sub-header': LoginSubHeader
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    active() {

      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '账号激活成功',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        onConfirm: () => {
          this.$router.push('/home')
        }
      }).show()
    }
  }
}
</script>
