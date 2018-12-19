<template>
  <el-container>
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">讨论课总界面</common-sub-header>
    </el-header>
    <el-main>
      <el-table :data="tableData" row-class-name="content-text" :show-header="false">
        <el-table-column prop="name" align="center"></el-table-column>
        <el-table-column fixed="right" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="center">
              <el-button plain size="small" @click.native.prevent="enter">进入</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="big-gap" type="flex" justify="end">
        <el-button
          type="text"
          size="medium"
          class="orange-text"
          @click="dialogFormVisible = true"
        >正在进行讨论课</el-button>
      </el-row>
      <el-dialog title="请选择讨论课" :visible.sync="dialogFormVisible" width="80%" center>
        <el-form :model="form">
          <el-form-item :label-width="formLabelWidth">
            <el-row>
              <el-select>
                <el-option label="OOAD"></el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-row>
              <el-select>
                <el-option label="2016-(1)"></el-option>
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-row>
              <el-select>
                <el-option label="界面原型设计"></el-option>
              </el-select>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="orange-text" @click="dialogFormVisible = false">取消</el-button>
          <el-button class="orange-text" @click="dialogFormVisible = false">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'

export default {
  name: 'SeminarMainPage',
  components: {
    'common-sub-header': CommonSubHeader,
  }
}
</script>
