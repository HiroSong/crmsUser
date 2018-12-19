<template>
  <el-row type="flex" justify="center">
    <el-col :span="24">
      <div class="title-label text-center orange-text" v-if="isMobile">讨论课管理平台</div>
      <div class="title-label blue-text" v-else>翻转课堂管理平台</div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['isMobile']
}
</script>