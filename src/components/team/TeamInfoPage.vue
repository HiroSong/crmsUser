<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="student" :is-mobile="true">课程名 年级 班级序号</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-row type="flex" justify="end">
        <el-col :span="16">
          <div class="content-text bold-text text-center">小组编号 小组名</div>
        </el-col>
        <el-col :span="4">
          <!-- 若状态为invalid才显示 -->
          <div v-if="isInvalid" class="red-text text-center" style="font-size: 0.75rem;">invalid</div>
        </el-col>
      </el-row>
      <!-- 若为本人，则将名字标色 -->
      <el-row type="flex" justify="space-around" class="small-gap">
        <el-col :span="4">
          <div class="tip-text bold-text">组长：</div>
        </el-col>
        <el-col :span="12">
          <div class="tip-text">学号</div>
        </el-col>
        <el-col :span="8">
          <div class="tip-text">姓名</div>
        </el-col>
      </el-row>
      <!-- 判断是否有组员 -->
      <div>
        <el-row type="flex" justify="space-around">
          <el-col :span="4">
            <!-- 判断是否为第一个组员 -->
            <div class="tip-text bold-text">组员：</div>
          </el-col>
          <el-col :span="12">
            <div class="tip-text">学号</div>
          </el-col>
          <el-col :span="8">
            <div class="tip-text">姓名</div>
          </el-col>
        </el-row>
      </div>
      <div v-if="isLeader">
        <el-row>
          <div class="tip-text bold-text small-gap">添加成员</div>
        </el-row>
        <cube-checkbox-group
          v-model="newMemberList"
          :options="ungroupedList"
          class="tip-text small-gap"
        ></cube-checkbox-group>
        <el-row type="flex" justify="center">
          <el-button
            type="danger"
            plain
            class="normal-gap"
            size="mini"
            @click.native.prevent="dismissTeam"
          >解散</el-button>
          <el-button
            plain
            class="orange-text normal-gap"
            size="mini"
            @click.native.prevent="addMember"
          >添加</el-button>
          <el-button
            plain
            class="orange-text normal-gap"
            size="mini"
            @click.native.prevent="saveTeam"
          >保存</el-button>
        </el-row>
      </div>
      <div v-else>
        <el-row type="flex" justify="end">
          <el-button
            type="danger"
            plain
            class="normal-gap"
            size="mini"
            @click.native.prevent="leaveTeam"
          >退出</el-button>
        </el-row>
      </div>
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
      isLeader: true,
      isInvalid: true,
      ungroupedList: [{
        label: '学号-姓名',
        value: 'id1'
      }, {
        label: '学号-姓名',
        value: 'id2'
      }],
      newMemberList: []
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
    },
    dismissTeam() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定解散队伍吗？',
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
    addMember() {
      // 将newMemberList添加到成员列表中
    },
    deleteMember() {
      // 将某个成员从列表中移除
    },
    saveTeam() {
      // 将成员列表发送到服务器更新
    }
  }
}
</script>
