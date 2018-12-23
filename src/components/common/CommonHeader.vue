<template>
  <el-row v-if="isMobile">
    <el-row type="flex" justify="space-between">
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <div class="title-label text-center orange-text">我</div>
      </el-col>
      <el-col :span="2">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="cubeic-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link
              to="/account/todo"
              class="no-decoration"
              v-if="role==='teacher'"
              key="todo"
            >
              <el-dropdown-item class="tip-text">待办</el-dropdown-item>
            </router-link>
            <router-link to="/home" class="no-decoration">
              <el-dropdown-item class="tip-text">个人页</el-dropdown-item>
            </router-link>
            <router-link to="/seminar/main" class="no-decoration">
              <el-dropdown-item class="tip-text">讨论课</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-row>
  <el-row v-else>
    <el-col :span="12">
      <div class="title-label blue-text">翻转课堂管理平台</div>
    </el-col>
    <el-col :offset="11" :span="1">
      <el-button
        type="text"
        class="iconfont icon-guanji blue-text title-label text-end"
        @click.native.prevent="logOut"
      >
        <span v-if="isCollapse===false">退出</span>
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['role', 'isMobile'],
  computed: {
    isCollapse() {
      if (Number(this.$store.state.screenWidth) < 1200) {
        this.$store.commit('SET_COLLAPSE', { isCollapse: true })
      } else {
        this.$store.commit('SET_COLLAPSE', { isCollapse: false })
      }
      return this.$store.state.isCollapse
    }
  },
  watch: {
    '$store.state.screenWidth': function (val) {
      if (Number(val) < 1200) {
        this.$store.commit('SET_COLLAPSE', { isCollapse: true })
      } else {
        this.$store.commit('SET_COLLAPSE', { isCollapse: false })
      }
    }
  },
  methods: {
    logOut() {
      this.$router.push('/login')
    }
  }
}
</script>
