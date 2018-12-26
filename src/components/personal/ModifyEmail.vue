<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">修改邮箱</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-validator
        :model="email"
        :rules="{ required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i }"
        v-model="emailValid"
      >
        <cube-input
          v-model="email"
          placeholder="请输入新邮箱"
          type="text"
          :autofocus="true"
          :autocomplete="true"
          :clearable="true"
          class="normal-gap"
        ></cube-input>
      </cube-validator>
      <el-row type="flex" justify="end" class="small-gap">
        <div class="tip-text">* 邮箱格式如: user@host.domainname</div>
      </el-row>
      <el-row type="flex" justify="center" class="top">
        <el-col :span="12">
          <el-button plain class="orange-text full-width" @click.native.prevent="setEmail">确认</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'ModifyEmailPage',
  data() {
    return {
      email: undefined,
      emailValid: undefined
    }
  },
  components: {
    'common-sub-header': CommonSubHeader
  },
  computed: {
    role() {
      return this.$store.state.role
    },
    id() {
      return this.$store.state.id
    }
  },
  methods: {
    setEmail() {
      if (this.emailValid) {
        this.$http.put('/' + this.role + '/' + this.id + '/information', {
          email: this.email
        }).then(() => this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '邮箱修改成功',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false
          },
          onConfirm: () => {
            this.$router.back()
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
