<template>
  <footer>
    <div class="inner">
      <audio :src="musicServer" crossorigin="anonymous" ref="audio"></audio>
      <div class="btns" >
        <i class="iconfont icon-step-backward"></i>
        <i :class="['iconfont', isPlaying ? 'icon-pause' : 'icon-play']" @click="playOrPause"></i>
        <i class="iconfont icon-step-forward"></i>
      </div>
      <div class="progress">
        <div class="figure">
          <img src="../../assets/images/1.jpeg" />
        </div>
        <div class="figcation">
          <div class="music-info">
            Eminem-The Way I Am
          </div>
          <div class="bar" @click="clickProcessBar" ref="bar">
            <div class="percentage" :style="{width: percentage + '%'}"></div>
          </div>
        </div>
      </div>
      <div class="controls">
        <i class="iconfont icon-cycle"></i>
        <i class="iconfont icon-volume-on"></i>
        <i class="iconfont icon-play-list"></i>
      </div>
    </div>
  </footer>
</template>
<script>
  import {ipcRenderer} from 'electron'
  export default {
    data () {
      return {
        musicServer: '',
        animationId: '',
        isPlaying: false,
        percentage: 0
      }
    },
    created () {
      ipcRenderer.on('music-server-config', (e, {port, allowKeys}) => {
        let filePath = 'E:/music/Stray Kids-극과 극.wav'
        this.musicServer = `http://localhost:${port}/${encodeURIComponent(filePath)}`
      })
      ipcRenderer.send('view-ready')
    },
    methods: {
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
  }
</style>