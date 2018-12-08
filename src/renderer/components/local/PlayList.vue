<template>
  <div class="play-list" ref="scroll">
    <div class="inner">
      <el-row :gutter="25">
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/1.jpeg" />
              <ul class="tags clearfix">
                <li class="tag-item">
                  <a href="javascript:;">#hip hop</a>
                </li>
                <li class="tag-item">
                  <a href="javascript:;">#R&B</a>
                </li>
              </ul>
              <div class="btn-wrapper">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/2.jpeg" />
            </div>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/3.jpeg" />
            </div>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/4.jpeg" />
            </div>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/2.jpeg" />
            </div>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/4.jpeg" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Row, Col} from 'element-ui'
  import BScroll from 'better-scroll'
  Vue.use(Row)
  Vue.use(Col)
  export default {
    data () {
      return {}
    },
    mounted () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          probeType: 1,
          click: true,
          mouseWheel: {
            speed: 20,
            invert: false
          },
          scrollbar: {
            fade: false,
            interactive: true
          }
        })
      })
    }
  }
</script>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  .play-list{
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 @app-lr-padding;
    .inner{
      padding: 20px 0;
    }
  }
  .el-col{
    text-align: center;
  }
</style>