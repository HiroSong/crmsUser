<template>
  <el-row>
    <el-col :span="24">
      <el-card shadow="never">
        <div class="bold-text title-text blue-text">
          <slot></slot>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>