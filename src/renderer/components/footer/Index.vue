<template>
  <footer>
    <div class="inner">
      <audio :src="musicServer + encodeURIComponent(playingMusic.path)" crossorigin="anonymous" ref="audio"></audio>
      <div class="btns" >
        <i class="iconfont icon-step-backward" @click="backward"></i>
        <i :class="['iconfont', isPlaying ? 'icon-pause' : 'icon-play']" @click="playOrPause"></i>
        <i class="iconfont icon-step-forward" @click="forward"></i>
      </div>
      <div class="progress">
        <div class="figure">
          <img :src="imageServer + encodeURIComponent(playingMusic.path)" />
        </div>
        <div class="figcation">
          <div class="music-info">
            {{musicInfo}}
          </div>
          <div class="bar" @click="clickProcessBar" ref="bar">
            <div class="percentage" :style="{width: percentage + '%'}"></div>
          </div>
        </div>
      </div>
      <div class="controls">
        <i :class="['iconfont', playModeClass]" @click="changePlayMode"></i>
        <i :class="['iconfont volume', volume === 0 ? 'icon-volume-off' : 'icon-volume-on']" @click="volumeControllerVisible = true">
          <div class="volume-controller" v-show="volumeControllerVisible">
            <el-slider v-model="volume" vertical height="120px"></el-slider>
          </div>
        </i>
        <i class="iconfont icon-play-list"></i>
      </div>
      <div v-show="volumeControllerVisible" class="volume-controller-mask" @click="volumeControllerVisible = false"></div>
    </div>
  </footer>
</template>
<script>
  import {ipcRenderer} from 'electron'
  import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        animationId: '',
        isPlaying: false,
        percentage: 0,
        musicServerPort: 0,
        volume: 100,
        volumeControllerVisible: false
      }
    },
    watch: {
      volume (newValue, oldValue) {
        const audio = this.$refs.audio
        audio.volume = newValue * 0.01
      },
      flag (newValue, oldValue) {
        const audio = this.$refs.audio
        if (newValue === 'pause') {
          // 加延迟，等音频文件就绪
          this.$nextTick(() => {
            audio.pause()
            this._stopDrawProcessBar()
            this.isPlaying = false
          })
        } else if (newValue === 'stop') {
          this.$nextTick(() => {
            audio.pause()
            this._stopDrawProcessBar()
            this.percentage = 0
            this.isPlaying = false
          })
        } else if (newValue.includes('reload')) {
          audio.currentTime = 0
        } else {
          this.$nextTick(() => {
            audio.play()
            this._drawProcessBar()
            this.isPlaying = true
          })
        }
        this.setPlayingMusicStatus()
        this.setPlayingStatus(this.playingMusic.id)
      }
    },
    computed: {
      ...mapState('Music', [
        'playingMusic',
        'flag',
        'playMode',
        'playListMusic',
        'playListInfo'
      ]),
      ...mapGetters('Music', [
        'imageServer',
        'shuffled'
      ]),
      musicServer () {
        return `http://localhost:${this.musicServerPort}/`
      },
      playModeClass () {
        return `icon-${this.playMode}`
      },
      musicInfo () {
        return this.playingMusic.id ? `${this.playingMusic.artist}-${this.playingMusic.title}` : '欢迎使用I1Music'
      }
    },
    created () {
      ipcRenderer.on('music-server-config', (e, {port, allowKeys}) => {
        this.musicServerPort = port
        // 去掉点，并存入vuex，用于后续创建歌单导入音乐时限定文件格式
        allowKeys.forEach((item, index) => {
          allowKeys[index] = item.replace('.', '')
        })
        this.setAllowKeys(allowKeys)
      })
      ipcRenderer.on('image-server-config', (e, port) => {
        this.setImageServerPort(port)
      })
      ipcRenderer.send('view-ready')
    },
    mounted () {
      let audio = this.$refs.audio
      audio.addEventListener('ended', () => {
        if (this.playMode === 'single') {
          audio.play()
        } else {
          this.forward()
        }
      })
    },
    methods: {
      ...mapActions('Music', [
        'setAllowKeys',
        'setImageServerPort',
        'setPlayMode',
        'setPlayingStatus',
        'setPlayingMusicStatus',
        'prepareToPlay'
      ]),
      clickVolume () {
        this.volumeControllerVisible = !this.volumeControllerVisible
      },
      changePlayMode () {
        this.setPlayMode()
      },
      /**
       * 播放实时时更新进度条
       * @private
       */
      _drawProcessBar () {
        const audio = this.$refs.audio
        this.anmationId = window.requestAnimationFrame(this._drawProcessBar)
        this.percentage = audio.currentTime / audio.duration * 100
      },
      /**
       * 停止更新进度条
       * @private
       */
      _stopDrawProcessBar () {
        window.cancelAnimationFrame(this.anmationId)
      },
      /**
       * 点击进度时，调整音频时间点
       * @param e
       */
      clickProcessBar (e) {
        const audio = this.$refs.audio
        const rate = e.offsetX / this.$refs.bar.clientWidth
        this.percentage = rate * 100
        audio.currentTime = rate * audio.duration
      },
      /**
       * 播放/停止音乐
       */
      playOrPause () {
        // 没有待播放的音乐不执行
        if (!this.playingMusic.id) {
          return
        }
        const audio = this.$refs.audio
        if (audio.paused || audio.ended) {
          audio.play()
          this._drawProcessBar()
          this.isPlaying = true
        } else {
          audio.pause()
          this._stopDrawProcessBar()
          this.isPlaying = false
        }
        this.setPlayingMusicStatus()
        this.setPlayingStatus(this.playingMusic.id)
      },
      backward () {
        // 没有待播放的音乐不执行
        if (!this.playingMusic.id) {
          return
        }
        let music = this._prevMusic()
        this.prepareToPlay(music)
      },
      _prevMusic () {
        if (this.playMode === 'shuffle') {
          let prevIndex = 0
          for (let i = 0, len = this.shuffled.length; i < len; i++) {
            let musicId = this.shuffled[i]
            if (musicId === this.playingMusic.id) {
              prevIndex = i - 1 === -1 ? len - 1 : i - 1
            }
          }
          let prevMusicId = this.shuffled[prevIndex]
          let resultMusic = {}
          for (let i = 0, len = this.playListMusic.length; i < len; i++) {
            let music = this.playListMusic[i]
            if (prevMusicId === music.id) {
              resultMusic = {
                album: music.album,
                artist: music.artist,
                id: music.id,
                duration: music.duration,
                path: music.path,
                title: music.title,
                playListId: this.playListInfo.id,
                isPlaying: music.isPlaying
              }
              break
            }
          }
          return resultMusic
        } else {
          let prevIndex = 0
          for (let i = 0, len = this.playListMusic.length; i < len; i++) {
            let music = this.playListMusic[i]
            if (music.id === this.playingMusic.id) {
              prevIndex = i - 1 === -1 ? len - 1 : i - 1
            }
          }
          return {
            album: this.playListMusic[prevIndex].album,
            artist: this.playListMusic[prevIndex].artist,
            id: this.playListMusic[prevIndex].id,
            duration: this.playListMusic[prevIndex].duration,
            path: this.playListMusic[prevIndex].path,
            title: this.playListMusic[prevIndex].title,
            playListId: this.playListInfo.id,
            isPlaying: this.playListMusic[prevIndex].isPlaying
          }
        }
      },
      forward () {
        // 没有待播放的音乐不执行
        if (!this.playingMusic.id) {
          return
        }
        let music = this._nextMusic()
        this.prepareToPlay(music)
      },
      _nextMusic () {
        if (this.playMode === 'shuffle') {
          let nextIndex = 0
          for (let i = 0, len = this.shuffled.length; i < len; i++) {
            let musicId = this.shuffled[i]
            if (musicId === this.playingMusic.id) {
              nextIndex = i + 1 === len ? 0 : i + 1
            }
          }
          let nextMusicId = this.shuffled[nextIndex]
          let resultMusic = {}
          for (let i = 0, len = this.playListMusic.length; i < len; i++) {
            let music = this.playListMusic[i]
            if (nextMusicId === music.id) {
              resultMusic = {
                album: music.album,
                artist: music.artist,
                id: music.id,
                duration: music.duration,
                path: music.path,
                title: music.title,
                playListId: this.playListInfo.id,
                isPlaying: music.isPlaying
              }
              break
            }
          }
          return resultMusic
        } else {
          let nextIndex = 0
          for (let i = 0, len = this.playListMusic.length; i < len; i++) {
            let music = this.playListMusic[i]
            if (music.id === this.playingMusic.id) {
              nextIndex = i + 1 === len ? 0 : i + 1
            }
          }
          return {
            album: this.playListMusic[nextIndex].album,
            artist: this.playListMusic[nextIndex].artist,
            id: this.playListMusic[nextIndex].id,
            duration: this.playListMusic[nextIndex].duration,
            path: this.playListMusic[nextIndex].path,
            title: this.playListMusic[nextIndex].title,
            playListId: this.playListInfo.id,
            isPlaying: this.playListMusic[nextIndex].isPlaying
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  @footer-color: #fff;
  footer{
    background-color: @app-hf-bg-color;
    line-height: @app-footer-height;
    padding: 0 @app-lr-padding;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
  @inner-lr-padding: 250px;
  .inner{
    padding: 0 @inner-lr-padding;
    position: relative;
    .btns{
      left: 0;
      top: 0;
      text-align: center;
      width: @inner-lr-padding;
      position: absolute;
    }
    .controls{
      right: 0;
      top: 0;
      width: @inner-lr-padding;
      position: absolute;
      text-align: center;
    }
    .progress{
      .figure{
        float: left;
        width: @app-footer-height;
        height: @app-footer-height;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .figcation{
        margin-left: @app-footer-height + 20;
        padding: 23px 0 ;
        .music-info{
          text-align: center;
          font-size: 14px;
          color: @footer-color;
          line-height: normal;
          margin-bottom: 15px;
        }
        .bar{
          height: 3px;
          background-color: #333d47;
          position: relative;
          cursor: pointer;
          .percentage{
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: @footer-color;
          }
        }
      }
    }
    i{
      color: @footer-color;
      font-size: 24px;
      margin: 0 10px;
      cursor: pointer;
    }
    @controller-zindex: 11;
    .volume{
      position: relative;
      @controller-height: 160px;
      @triangle-height: 10px;
      @controller-bg-color: rgba(255, 255, 255, .5);
      .volume-controller{
        z-index: @controller-zindex;
        background-color: @controller-bg-color;
        width: 70px;
        height: @controller-height;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -(@controller-height + @triangle-height);
        box-sizing: border-box;
        padding: 20px 16px;
        &:after{
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -@triangle-height;
          border-top: @triangle-height/2 solid @controller-bg-color;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: @triangle-height/2 solid transparent;
        }
      }
    }
    .volume-controller-mask{
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: @controller-zindex - 1;
    }
  }
</style>