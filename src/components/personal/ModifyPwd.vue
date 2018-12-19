<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">修改密码</common-sub-header>
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
        <div class="tip-text text-end">* 可包含数字、字母、下划线
          <br>长度不小于6位
        </div>
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
      password: undefined,
      passwordConfirm: undefined
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

      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '密码修改成功',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        onConfirm: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
