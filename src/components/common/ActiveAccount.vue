<template>
  <el-container>
    <el-header class="header">
      <login-sub-header>激活账户</login-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-validator
        :model="password"
        :rules="{ required: true, pattern: /^[\\u4E00-\\u9FA5A-Za-z0-9_]{6,}$/i , notRow: (val)=>val!=='123456'}"
        :messages="{
          notRow: '不能为123456'
          }"
        v-model="passwordValid"
      >
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
      </cube-validator>
      <el-row type="flex" justify="end" class="small-gap">
        <div class="tip-text text-end">* 可包含数字、字母、下划线，
          <br>长度不小于6位
        </div>
      </el-row>
      <cube-validator
        :model="passwordConfirm"
        :rules="{ required: true, repeated: (val)=>val===this.password }"
        :messages="{
          required:'此为必填项',
          repeated: '必须与上一条输入相同'
          }"
        v-model="passwordConfirmValid"
      >
        <cube-input
          v-model="passwordConfirm"
          placeholder="请再次输入密码"
          type="password"
          :autocomplete="true"
          :clearable="true"
          :eye="{open:false, reverse:false}"
          class="normal-gap"
        ></cube-input>
      </cube-validator>
      <div v-if="role!=='teacher'">
        <cube-validator
          :model="email"
          :rules="{ required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i }"
          v-model="emailValid"
        >
          <cube-input
            v-model="email"
            placeholder="请输入邮箱"
            type="text"
            :autocomplete="true"
            :clearable="true"
            class="normal-gap"
          ></cube-input>
        </cube-validator>
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
      email: undefined,
      passwordValid: undefined,
      passwordConfirmValid: undefined,
      emailValid: undefined
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
      if (!(this.passwordValid && this.passwordConfirmValid))
        return
      if (this.role !== 'teacher' && !this.emailValid)
        return
      this.$http.put('/' + this.role + '/active', {
        id: this.$store.state.id,
        email: this.email,
        password: this.password
      }).then(() => this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '账号激活成功',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        onConfirm: () => {
          this.$store.commit('ACTIVE_ACCOUNT', { beActive: true })
          this.$router.push('/home')
        }
      }).show()).catch(error => {
        this.$createToast({
          time: 500,
          txt: '账号激活失败，请重新尝试',
          type: 'error'
        }).show()
      })
    }
  }
}
</script>
