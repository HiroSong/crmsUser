<template>
  <el-container>
    <el-header class="header">
      <common-sub-header role="teacher" :is-mobile="true">待办</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <svg class="icon" style="width:0.875rem; height:0.875rem;" aria-hidden="true">
              <use xlink:href="#icon-jingshi"></use>
            </svg>
            <div class="content-text">消息标题</div>
          </template>
          <div class="tip-text">消息内容</div>
          <el-row type="flex" justify="space-around" class="small-gap">
            <svg
              class="icon"
              style="width:0.875rem; height:0.875rem;"
              aria-hidden="true"
              @click.native.prevent="accept"
            >
              <use xlink:href="#icon-dagou"></use>
            </svg>
            <svg
              class="icon"
              style="width:0.875rem; height:0.875rem;"
              aria-hidden="true"
              @click.native.prevent="reject"
            >
              <use xlink:href="#icon-cha"></use>
            </svg>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row>
        <div class="normal-gap content-text">历史消息</div>
      </el-row>
      <el-collapse accordion class="small-gap">
        <el-collapse-item>
          <template slot="title">
            <svg class="icon" style="width:0.875rem; height:0.875rem;" aria-hidden="true">
              <use xlink:href="#icon-dagou"></use>
            </svg>
            <div class="content-text">消息标题</div>
          </template>
          <div class="tip-text">消息内容</div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'TodoPage',
  components: {
    'common-sub-header': CommonSubHeader
  },
  methods: {
    accept() {

    },
    reject() {

    }
  }
}
</script>
