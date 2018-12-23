<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">组队</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <el-col :span="8">
              <div class="iconfont icon-xiaozu content-text">&nbsp;组编号</div>
            </el-col>
            <el-col :span="8">
              <div class="content-text">组名</div>
            </el-col>
            <el-col :span="4">
              <!-- 若为当前所在小组则显示 -->
              <el-button
                v-if="role!=='teacher'"
                type="text"
                plain
                class="iconfont icon-xuesheng orange-text full-width"
                style="font-size: 0.75rem;"
                @click.native.prevent="enterTeamInfo"
              >进入</el-button>
            </el-col>
            <el-col :span="4">
              <!-- 若状态为invalid才显示 -->
              <div class="red-text text-center" style="font-size: 0.75rem;">invalid</div>
            </el-col>
          </template>
          <el-row type="flex" justify="space-around">
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
        </el-collapse-item>
        <el-collapse-item v-if="role!=='teacher'">
          <template slot="title">
            <div class="iconfont icon-danren content-text">&nbsp;未组队学生</div>
          </template>
          <el-row>
            <el-col :span="12">
              <div class="tip-text">学号</div>
            </el-col>
            <el-col :span="12">
              <div class="tip-text">姓名</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!-- 根据是否已经组队决定是否显示 -->
      <el-row type="flex" justify="center" v-if="role!=='teacher'">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="createTeam"
          >创建小组</el-button>
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

    }
  },
  computed: {
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    enterTeamInfo() {

      this.$router.push("/team/info")
    },
    createTeam() {

      this.$router.push("/team/create")
    }
  }
}
</script>
