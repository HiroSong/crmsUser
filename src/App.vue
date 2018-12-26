<template>
  <div id="app">
    <adjust-screen :is-mobile="isMobile" v-if="needRotate"></adjust-screen>
    <div v-else>
      <transition name="fade" mode="out-in">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view></router-view>
        </keep-alive>
        <router-view v-else/>
      </transition>
    </div>
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

<style scoped>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1rem;
}
</style>
