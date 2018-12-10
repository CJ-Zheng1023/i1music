<template>
  <div class="play-list-detail" ref="scroll">
  <div class="inner">
    <el-row :gutter="50">
      <el-col :md="9">
        <div class="info">
          <div class="figure">
            <img src="../../assets/images/1.jpeg"/>
          </div>
          <ul class="tags">
            <li class="tag-item">
              <a href="javascript:;">#Hip Hop</a>
            </li>
            <li class="tag-item">
              <a href="javascript:;">#R&B</a>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :md="15">
        <div class="panel">
          <div class="panel-header clearfix">
            <h3 class="title">Eminem全专辑</h3>
            <div class="actions">
              <a href="javascript:;" class="btn btn-primary">
                <i class="iconfont icon-add"></i>
              </a>
              <a href="javascript:;" class="btn btn-danger">
                <i class="iconfont icon-delete"></i>
              </a>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  </div>
</template>
<script>
  export default {
    mounted () {
      this.$nextTick(() => {
        this.scroll = new this.$BScroll(this.$refs.scroll, {
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
  @box-border-radius: 5px;
  .play-list-detail{
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 @app-lr-padding;
    .inner{
      padding: 30px 0;
    }
  }
  .info{
    .figure{
      width: 100%;
      padding-bottom: 100%;
      position: relative;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: @box-border-radius;
      }
    }
    .tags{
      margin: 10px 0;
    }
  }
  .panel{
    background-color: #353536;
    height: 400px;
    border-radius: @box-border-radius;
    box-shadow: 1px 4px 10px 2px #575757;
    padding: 15px 25px;
    .panel-header{
      .title{
        font-size: 16px;
        color: #fff;
        margin: 0;
        padding: 15px 0 25px 0;
        text-align: center;
      }
      .actions{
        float: right;
      }
    }
  }
  .btn{
    display: inline-block;
    padding: 2px 4px;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #dcdfe6;
    color: #dcdfe6;
    font-size: 16px;
    margin: 3px;
    i{
      font-size: 15px;
    }
    &.btn-primary{
      background-color: #33a0e1;
      border-color: #33a0e1;
      &:hover{
        background-color: #38b2f9;
      }
    }
    &.btn-danger{
      background-color: #dc231f;
      border-color: #dc231f;
      &:hover{
        background-color: #fb2824;
      }
    }
    &.btn-default{
      background-color: #8d8d92;
      border-color: #8d8d92;
      &:hover{
        background-color: #b3b3b9;
      }
    }
  }
</style>