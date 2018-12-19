<template>
  <div id="app">
    <adjust-screen :is-mobile="isMobile" v-if="needRotate"></adjust-screen>
    <transition v-else name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import AdjustScreen from '@/components/common/AdjustScreen'

export default {
  name: 'App',
  computed: {
    isVertical() {
      return this.$store.state.isVertical
    },
    isMobile() {
      return this.$store.state.isMobile
    },
    needRotate() {
      return !((this.isMobile && this.isVertical) || (!this.isMobile && !this.isVertical))
    }
  },
  components: {
    'adjust-screen': AdjustScreen
  },
  mounted() {
    var _this = this
    window.onresize = () => {
      _this.$store.state.screenWidth = document.documentElement.clientWidth
      _this.$store.state.screenHeight = document.documentElement.clientHeight
      _this.$store.state.isMobile = navigator.userAgent.toLowerCase().match(/(phone|pad|pod|iphone|ipod|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian|windows phone)/i) !== null
      _this.$store.state.isVertical = document.documentElement.clientWidth < document.documentElement.clientHeight
    }
  }
}
</script>

<style>
body {
  margin: 0 5vw 0 5vw;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1rem;
}

.header {
  background-color: #ffffff;
  line-height: 3.75rem;
  height: 10vh;
}

.blue-color {
  background-color: #409eff;
}

.dark-text {
  color: #000000;
}

.light-text {
  color: #ffffff;
}

.green-text {
  color: #67c23a;
}

.orange-text {
  color: #fc9153;
}

.blue-text {
  color: #409eff;
}

.red-text {
  color: #f64a4e;
}

.bold-text {
  font-weight: bold;
}

.title-label {
  font-weight: bold;
  font-size: 1.25rem;
}

.no-decoration {
  text-decoration: none;
}

.big-gap {
  margin-top: 10vh;
}

.normal-gap {
  margin-top: 5vh;
}

.small-gap {
  margin-top: 2vh;
}

.top {
  margin-top: 15vh;
}

.text-start {
  text-align: start;
}

.text-center {
  text-align: center;
}

.text-end {
  text-align: end;
}

.side-bar {
  min-height: 90vh;
}

.full-height {
  height: 100%;
}

.full-width {
  width: 100%;
}

.title-text {
  font-size: 1.125rem;
}

.sub-title-text {
  font-size: 1rem;
  color: #303133;
}

.content-text {
  font-size: 0.875rem;
  color: #606266;
}

.tip-text {
  font-size: 0.75rem;
  color: #909399;
}

.light-text {
  color: #c0c4cc;
}

.main-gap {
  margin: 1vh 1vw 1vh 1vw;
}

.end {
  position: absolute;
  right: 0;
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
