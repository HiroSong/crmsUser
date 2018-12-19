<template>
  <el-menu :collapse="isCollapse" class="full-height side-bar" :router="true">
    <el-menu-item v-if="isTeacher" index="/course/class">
      <i class="iconfont icon-xinxi title-text" aria-hidden="true"></i>
      <span class="title-text" slot="title">&nbsp;导入学生名单</span>
    </el-menu-item>
    <el-menu-item index="/seminar">
      <i class="iconfont icon-ketangpeixun title-text" aria-hidden="true"></i>
      <span class="title-text" slot="title">&nbsp;讨论课</span>
    </el-menu-item>
    <el-menu-item index="/course/score">
      <i class="iconfont icon-chengjiguanli title-text" aria-hidden="true"></i>
      <span class="title-text" slot="title">&nbsp;导出成绩</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ['role'],
  computed: {
    isTeacher() {
      return this.role === 'teacher'
    },
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
  }
}
</script>
