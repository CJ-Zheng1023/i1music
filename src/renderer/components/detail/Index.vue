<template>
  <div class="container">
    <div class="info">
      <div class="banner">
        <img :src="image"/>
        <canvas></canvas>
      </div>
      <div class="title">{{playingMusic.title}}</div>
      <div class="artist">歌手:{{playingMusic.artist}}</div>
      <div class="album">专辑:{{playingMusic.album}}</div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters} from 'vuex'
  import utils from '@/common/scripts/utils'
  export default {
    computed: {
      ...mapState('Music', [
        'playingMusic',
        'defaultImage',
        'audioAnalyser',
        'flag'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ]),
      image () {
        return `${this.imageServer}${encodeURIComponent(this.playingMusic.path)}`
      },
      backgroundImage () {
        return `url("${this.image}")`
      }
    },
    watch: {
      playingMusic (newValue, oldValue) {
        utils.css('#app', 'backgroundImage', this.backgroundImage)
      },
      flag (newValue, oldValue) {
        if (newValue === 'pause' || newValue === 'stop') {
          this.stopDraw()
        } else {
          this.initDraw()
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        utils.css('#app', 'backgroundImage', vm.backgroundImage)
      })
    },
    beforeRouteLeave (to, from, next) {
      utils.css('#app', 'backgroundImage', this.defaultImage)
      this.stopDraw()
      next()
    },
    methods: {
      initDraw () {
        const canvas = document.querySelector('canvas')
        const canvasContext = canvas.getContext('2d')
        const arrayLength = this.audioAnalyser.frequencyBinCount
        const array = new Uint8Array(arrayLength)
        const width = canvas.width
        const height = canvas.height
        this.anmationId = window.requestAnimationFrame(this.initDraw)
        this.audioAnalyser.getByteFrequencyData(array)
        canvasContext.clearRect(0, 0, width, height)
        canvasContext.beginPath()
        canvasContext.moveTo(0, height - height / 256 * array[0])
        for (let i = 1, len = array.length; i < len; i++) {
          canvasContext.lineTo(width / len * i, height - height / 256 * array[i])
        }
        const gradient = canvasContext.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop('0', '#f500d8')
        gradient.addColorStop('1.0', '#ceaf11')
        canvasContext.strokeStyle = gradient
        canvasContext.stroke()
        canvasContext.closePath()
      },
      stopDraw () {
        window.cancelAnimationFrame(this.anmationId)
      }
    },
    mounted () {
      this.initDraw()
    }
  }
</script>
<style scoped lang="less">
  .container{
    position: relative;
    z-index: 2;
    height: 100%;
  }
  .info{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    max-width: 500px;
    text-align: center;
    color: #fff;
    .banner{
      width: 100%;
      padding-bottom: 100%;
      border: 8px solid rgba(0, 0, 0, .2);
      position: relative;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      }
      canvas{
        width: 100%;
        height: 50%;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
      }
    }
    .title{
      font-size: 18px;
      font-weight: 600;
      padding: 10px 0 8px 0;
    }
    .artist, .album{
      font-size: 15px;
      padding: 5px 0;
    }
  }
</style>