<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">修改密码</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-validator
        :model="oldPassword"
        :rules="{ required: true, pattern: /^[\\u4E00-\\u9FA5A-Za-z0-9_]{6,}$/i }"
        v-model="oldPasswordValid"
      >
        <cube-input
          v-model="oldPassword"
          placeholder="请输入原密码"
          type="password"
          :autofocus="true"
          :autocomplete="true"
          :clearable="true"
          :eye="{open:false, reverse:false}"
          class="normal-gap"
        ></cube-input>
      </cube-validator>
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
          :autocomplete="true"
          :clearable="true"
          :eye="{open:false, reverse:false}"
          class="small-gap"
        ></cube-input>
      </cube-validator>
      <el-row type="flex" justify="end" class="small-gap">
        <div class="tip-text text-end">* 可包含数字、字母、下划线
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
          class="small-gap"
        ></cube-input>
      </cube-validator>
      <el-row type="flex" justify="center" class="top">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="setPwd">确认</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'ModifyPwdPage',
  data() {
    return {
      oldPassword: undefined,
      password: undefined,
      passwordConfirm: undefined,
      oldPasswordValid: undefined,
      passwordValid: undefined,
      passwordConfirmValid: undefined
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
    setPwd() {
      if (this.oldPasswordValid && this.passwordValid && this.passwordConfirmValid) {
        this.$http.put('/user/password', {
          oldPassword: this.oldPassword,
          password: this.password
        }).then(() => this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '密码修改成功,请重新登录',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false
          },
          onConfirm: () => {
            this.$router.push('/login')
          }
        }).show()).catch(error => {
          this.$createToast({
            time: 500,
            txt: error.message,
            type: 'error'
          }).show()
        })
      }
    }
  }
}
</script>
