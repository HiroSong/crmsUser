<template>
  <el-row>
    <el-col :span="2">
      <router-link to>
        <i class="el-icon-arrow-left" v-on:click="goBack"></i>
      </router-link>
    </el-col>
    <el-col :span="20">
      <div class="title-label text-center orange-text">
        <slot></slot>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    goBack: function () {
      this.$router.back()
    }
  }
}
</script>
