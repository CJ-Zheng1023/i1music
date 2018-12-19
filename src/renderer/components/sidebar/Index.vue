<template>
  <div>
    <div v-show="isOpen" class="mask" @click="setIsOpen(false)"></div>
    <div :class="['side-bar', isOpen ? 'open' :'']">
      <div class="scroll" ref="scroll">
        <div class="inner">
          <ul class="music-list">
            <li v-for="item in playListMusic" :key="item.id" @click="clickPlay(item)">
              <div class="figure">
                <img :src="imageServer + encodeURIComponent(item.path)" />
              </div>
              <div class="info">
                <h4 class="title">{{item.title}}</h4>
                <div class="artist">{{item.artist}}</div>
              </div>
              <i v-show="item.isPlaying" class="iconfont icon-playing"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapState('Music', [
        'isOpen',
        'playListMusic',
        'playListInfo'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ])
    },
    methods: {
      ...mapActions('Music', [
        'setIsOpen',
        'prepareToPlay'
      ]),
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
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  @side-bar-width: 300px;
  .side-bar{
    position: fixed;
    right: -@side-bar-width;
    top: @app-header-height;
    width: @side-bar-width;
    bottom: @app-footer-height;
    background-color: rgba(255, 255,255, .8);
    transition: right .5s;
    // 为了遮住主界面的滚动条
    z-index: 9999;
    &.open{
      right: 0;
    }
  }
  .scroll{
    position: relative;
    height: 100%;
    overflow: hidden;
    .inner{
      padding: 15px;
    }
  }
  .music-list{
    padding: 0;
    margin: 0;
    li{
      list-style: none;
      padding: 10px 25px 10px 10px;
      cursor: pointer;
      position: relative;
      left: 0;
      transition: left .3s;
      &:hover{
        left: -10px;
      }
      @figure-height: 45px;
      .figure{
        float: left;
        width: 45px;
        height: @figure-height;
        img{
          height: 100%;
          width: 100%;
        }
      }
      .info{
        margin-left: 50px;
        min-height: @figure-height;
        .title{
          margin: 5px 0;
          font-size: 16px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .artist{
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      i{
        position: absolute;
        right: 3px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>