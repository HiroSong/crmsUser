<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="student" :is-mobile="true">课程名 年级 班级序号</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <cube-input v-model="name" placeholder="请输入小组名" :clearable="true" class="content-text"></cube-input>
      <el-row>
        <div class="content-text small-gap">添加成员</div>
      </el-row>
      <cube-checkbox-group v-model="memberList" :options="ungroupedList" class="tip-text small-gap"></cube-checkbox-group>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createTeam"
          >创建</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TeamPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  data() {
    return {
      ungroupedList: [{
        label: '学号-姓名',
        value: 'id1'
      }, {
        label: '学号-姓名',
        value: 'id2'
      }],
      memberList: []
    }
  },
  computed: {
  },
  methods: {
    createTeam() {
      this.$createToast({
        time: 500,
        txt: '创建成功',
        type: 'correct',
        onTimeout: () => {
          this.$router.back()
        }
      }).show()
    }
  }
}
</script>
