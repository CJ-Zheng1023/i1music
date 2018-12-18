<template>
  <div class="play-list-detail" ref="scroll">
    <div class="inner">
      <el-row :gutter="50">
        <el-col :md="9">
          <div class="info">
            <div class="figure">
              <img :src="imageServer + encodeURIComponent(playListInfo.cover)"/>
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
                <el-table-column width="120">
                  <template slot-scope="scope">
                    <div>{{scope.$index + 1}}</div>
                    <a :class="['btn-play-list', scope.row.isPlaying ? 'playing' : '']" href="javascript:;"
                       @click="clickPlay(scope.row)">
                      <i :class="['iconfont', scope.row.isPlaying ? 'icon-pause' : 'icon-play']"></i>
                    </a>
                    <a class="btn-play-list delete" href="javascript:;">
                      <i class="iconfont icon-window-close" @click="clickDelete(scope.row.id)"></i>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="歌曲" sortable></el-table-column>
                <el-table-column prop="artist" label="歌手"></el-table-column>
                <el-table-column prop="duration" label="时长" width="100"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <div></div>
    </div>
  </div>
</template>
<script>
  import { remote } from 'electron'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState('Music', [
        'playListInfo',
        'playListMusic',
        'playListTag',
        'allowKeys',
        'playingMusic'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ])
    },
    methods: {
      clickPlay (music) {
        this.prepareToPlay({
          album: music.album,
          artist: music.artist,
          id: music.id,
          duration: music.duration,
          path: music.path,
          title: music.title,
          playListId: this.playListInfo.id,
          isPlaying: music.isPlaying
        })
      },
      clickDelete (musicId) {
        this.removeMusic({musicId, playListId: this.playListInfo.id})
        if (musicId === this.playingMusic.id) {
          this.stopPlay()
        }
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
            this.addMusic({musicPaths: filePaths, id: this.$route.params.id}).catch(e => {
              console.log(e)
            })
          }
        })
      },
      deletePlayList () {
        this.removePlayList(this.$route.params.id)
        this.stopPlay()
        this.$router.push({path: '/local'})
      },
      ...mapActions('Music', [
        'queryPlayListDetail',
        'addMusic',
        'removePlayList',
        'prepareToPlay',
        'removeMusic',
        'stopPlay'
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
  .play-list-detail {
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 @app-lr-padding;
    .inner {
      padding: 30px 0;
    }
  }

  .info {
    .figure {
      width: 100%;
      padding-bottom: 100%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: @box-border-radius;
      }
    }
    .tags {
      margin: 10px 0;
    }
  }

  .panel {
    background-color: rgba(0, 0, 0, .25);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.05);
    border-radius: @box-border-radius;
    padding: 15px 25px 25px 25px;
    .panel-header {
      position: relative;
      padding: 30px 30px;
      .title {
        font-size: 16px;
        color: #fff;
        margin: 0;
        text-align: center;
      }
      .actions {
        position: absolute;
        right: 0;
        top: 0;
        .btn {
          display: inline-block;
          padding: 2px 4px;
          box-sizing: border-box;
          border-radius: 2px;
          // border: 1px solid #dcdfe6;
          color: #dcdfe6;
          font-size: 16px;
          margin: 3px;
          &:hover {
            background-color: rgba(0, 0, 0, .2);
          }
          i {
            font-size: 15px;
          }
        }
      }
    }
  }

  @btn-play-list-width: 50px;
  .btn-play-list {
    position: absolute;
    color: #fff;
    left: -@btn-play-list-width * 2;
    top: 0;
    height: 100%;
    width: @btn-play-list-width;
    background: linear-gradient(to right, #d66d75, #e29587);
    transition: left .5s;
    &.delete {
      left: -@btn-play-list-width;
      background: linear-gradient(to right, #f2994a, #f2c94c);
    }
    &.playing {
      left: 0;
    }
    i {
      position: absolute;
      font-size: 18px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .el-table tbody tr:hover {
    .btn-play-list {
      left: 0;
      &.delete {
        left: @btn-play-list-width;
      }
    }
  }
</style>