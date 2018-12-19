<template>
  <el-container v-if="isMobile">
    <el-header class="header">
      <common-sub-header :role="role" :is-mobile="true">{{courseName}}</common-sub-header>
    </el-header>
    <el-main class="main-gap">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="content-text bold-text">{{round}}</div>
          </template>
          <div v-if="role==='teacher'">
            <el-row>
              <el-button
                type="text"
                plain
                class="iconfont icon-shezhi content-text full-width text-start"
                @click.native.prevent="enterSetting"
              >该轮轮次设置</el-button>
            </el-row>
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <div class="content-text">业务流程分析</div>
                  <el-button
                    type="text"
                    plain
                    class="iconfont icon-xiugai orange-text"
                    @click.native.prevent="enterModify"
                  ></el-button>
                </template>
                <el-row>
                  <el-button
                    type="text"
                    plain
                    class="tip-text full-width"
                    @click.native.prevent="enterSeminar"
                  >2016(1)</el-button>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else>
            <el-button
              type="text"
              plain
              class="content-text full-width text-start"
              @click.native.prevent="enterSeminar"
            >1-业务流程分析</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-row type="flex" justify="center" v-if="role==='teacher'">
        <el-col :span="12">
          <el-button
            plain
            class="normal-gap orange-text full-width"
            @click.native.prevent="enterCreate"
          >新建讨论课</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header">
      <common-sub-header :role="role"></common-sub-header>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <common-aside :role="role"></common-aside>
      </el-aside>
      <el-main class="main-gap">
        <title-card>{{modifiedTitle}}</title-card>
        <el-card shadow="hover" class="normal-gap">
          <div style="height: 60vh;">
            <el-scrollbar class="full-height">
              <el-row type="flex" justify="center">
                <el-col :span="12">
                  <el-collapse accordion>
                    <el-collapse-item class="content-text">
                      <template slot="title">
                        <div class="sub-title-text bold-text">{{round}}</div>
                      </template>
                      <el-table
                        :data="tableData"
                        :show-header="false"
                        row-class-name="content-text"
                      >
                        <el-table-column prop="name" align="center"></el-table-column>
                        <el-table-column fixed="right" align="center">
                          <template slot-scope="scope">
                            <el-button
                              plain
                              type="primary"
                              size="small"
                              @click.native.prevent="enter"
                            >进入</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="12">
                  <el-collapse accordion>
                    <el-collapse-item class="content-text">
                      <template slot="title">
                        <div class="sub-title-text bold-text">{{round}}</div>
                      </template>
                      <el-table
                        :data="tableData"
                        :show-header="false"
                        row-class-name="content-text"
                      >
                        <el-table-column prop="name" align="center"></el-table-column>
                        <el-table-column fixed="right" align="center">
                          <template slot-scope="scope">
                            <el-button
                              plain
                              type="primary"
                              size="small"
                              @click.native.prevent="enterSeminar"
                            >进入</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonSubHeader from '@/components/common/CommonSubHeader'
import CommonAside from '@/components/common/CommonAside'
import TitleCard from '@/components/common/TitleCard'

export default {
  name: 'SeminarPage',
  components: {
    'common-sub-header': CommonSubHeader,
    'common-aside': CommonAside,
    'title-card': TitleCard
  },
  data() {
    return {
      round: "第一轮讨论课",
      tableData: [{
        name: "第一次讨论课--需求分析"
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }, {
        name: '第二次讨论课--界面原型'
      }],
      courseName: undefined,
      dialogFormVisible: false
    }
  },
  computed: {
    modifiedTitle() {
      return this.courseName + '-讨论课'
    },
    role() {
      // return this.$store.state.role
      return 'teacher'
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  methods: {
    enterSeminar() {
      this.$router.push('/seminar/info')
    },
    enterSetting() {
      this.$router.push('/seminar/setting')
    },
    enterModify() {
      this.$router.push('/seminar/modify')
    },
    enterCreate() {
      this.$router.push('/seminar/create')
    }
  }
}
</script>
