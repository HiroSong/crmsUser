<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">共享设置</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="content-text bold-text">课程名(教师名)</div>
          </template>
          <el-row>
            <el-col :span="8" class="content-text">共享类型：</el-col>
            <el-col :span="16" class="content-text text-center">共享讨论课</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="content-text">共享情况：</el-col>
            <el-col :span="16" class="content-text text-center">主课程</el-col>
          </el-row>
          <el-row type="flex" justify="end" class="small-gap">
            <el-button
              plain
              class="orange-text"
              size="small"
              @click.native.prevent="cancleSharing"
            >取消共享</el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createSharing"
          >新增共享</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'ApplicationPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  methods: {
    cancleSharing() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定取消与该课程的共享吗？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        cancelBtn: {
          text: '放弃',
          active: false,
          disabled: false
        },
        onConfirm: () => {
          // ajax取消共享
        }
      }).show()
    },
    createSharing() {
      this.$router.push('/application/create')
    }
  }
}
</script>
