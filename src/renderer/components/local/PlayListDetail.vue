<template>
  <div class="play-list-detail" ref="scroll">
  <div class="inner">
    <el-row :gutter="50">
      <el-col :md="9">
        <div class="info">
          <div class="figure">
            <img :src="imageServer + '/' + playListInfo.cover"/>
          </div>
          <ul class="tags">
            <li class="tag-item" v-for="item in playListTag">
              <a href="javascript:;"># {{item}}</a>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :md="15">
        <div class="panel">
          <div class="panel-header clearfix">
            <h3 class="title">{{playListInfo.title}}</h3>
            <div class="actions">
              <a href="javascript:;" class="btn" @click="chooseMusic">
                <i class="iconfont icon-add"></i>
              </a>
              <a href="javascript:;" class="btn" @click="deletePlayList">
                <i class="iconfont icon-delete"></i>
              </a>
            </div>
          </div>
          <div class="panel-body">
            <el-table :data="playListMusic" current-row-key="title" header-row-class-name="i-table-header">
              <el-table-column type="index" :index="indexMethod"></el-table-column>
              <el-table-column prop="title" label="歌曲" sortable></el-table-column>
              <el-table-column prop="artist" label="歌手"></el-table-column>
              <el-table-column prop="duration" label="时长"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  </div>
</template>
<script>
  import {remote} from 'electron'
  import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        chosenMusicSet: new Set()
      }
    },
    computed: {
      ...mapState('Music', [
        'playListInfo',
        'playListMusic',
        'playListTag',
        'allowKeys'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ]),
      chosenMusicArray () {
        return Array.from(this.chosenMusicSet)
      }
    },
    methods: {
      indexMethod (index) {
        return index + 1
      },
      chooseMusic () {
        remote.dialog.showOpenDialog({
          title: '选择音乐',
          filters: [
            {
              name: 'music',
              extensions: this.allowKeys
            }
          ],
          properties: ['openFile', 'multiSelections']
        }, filePaths => {
          if (filePaths) {
            this.chosenMusicSet = new Set([...this.chosenMusicSet, ...filePaths])
            this.addMusic({musicPaths: this.chosenMusicArray, id: this.$route.params.id}).catch(e => {
              console.log(e)
            })
          }
        })
      },
      deletePlayList () {
        this.removePlayList(this.$route.params.id)
        this.$router.push({path: '/local'})
      },
      ...mapActions('Music', [
        'queryPlayListDetail',
        'addMusic',
        'removePlayList'
      ])
    },
    mounted () {
      this.queryPlayListDetail(this.$route.params.id)
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
    // border: 1px solid #dcdfe6;
    color: #dcdfe6;
    font-size: 16px;
    margin: 3px;
    &:hover{
      background-color: rgba(0, 0, 0, .2);
    }
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