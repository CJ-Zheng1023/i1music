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
          <div class="panel-body">
            <el-table :data="musicList" header-row-class-name="i-table-header">
              <el-table-column type="index" :index="indexMethod"></el-table-column>
              <el-table-column prop="song" label="歌曲" sortable></el-table-column>
              <el-table-column prop="singer" label="歌手"></el-table-column>
              <el-table-column prop="time" label="时长"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        musicList: [
          {
            song: 'song1',
            singer: 'singer1',
            time: '4:05'
          },
          {
            song: 'song2',
            singer: 'singer2',
            time: '3:22'
          },
          {
            song: 'song3',
            singer: 'singer3',
            time: '5:00'
          },
          {
            song: 'song1',
            singer: 'singer1',
            time: '4:05'
          },
          {
            song: 'song2',
            singer: 'singer2',
            time: '3:22'
          },
          {
            song: 'song3',
            singer: 'singer3',
            time: '5:00'
          }
        ]
      }
    },
    methods: {
      indexMethod (index) {
        return index + 1
      }
    },
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
    background-color: rgba(0, 0, 0, .25);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.05);
    border-radius: @box-border-radius;
    padding: 15px 25px 25px 25px;
    .panel-header{
      position: relative;
      padding: 30px 30px;
      .title{
        font-size: 16px;
        color: #fff;
        margin: 0;
        text-align: center;
      }
      .actions{
        position: absolute;
        right: 0;
        top: 0;
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