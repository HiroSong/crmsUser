<template>
  <el-container>
    <el-main>
      <div v-if="isMobile" class="full-screen">
        <div class="title-label text-center top red-text">请使用竖屏浏览</div>
        <el-row type="flex" justify="center" class="big-gap">
          <i class="iconfont icon-hengpingzhuanshuping title-text red-text"></i>
        </el-row>
      </div>
      <div v-else class="full-screen">
        <div class="title-label text-center top red-text">请使用横屏浏览</div>
        <el-row type="flex" justify="center" class="big-gap">
          <i class="iconfont icon-spzhping title-text red-text"></i>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: ['isMobile']
}
</script>

<style scoped>
.full-screan {
  height: 100vh;
  width: 100vw;
  background-color: #e8f2ff;
}
</style>
