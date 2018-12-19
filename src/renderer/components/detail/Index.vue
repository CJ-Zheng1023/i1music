<template>
  <div class="container">
    <div class="info">
      <div class="banner">
        <img :src="image"/>
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
        'defaultImage'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ]),
      image () {
        return `${this.imageServer}${encodeURIComponent(this.playingMusic.path)}`
      },
      backgroundImage () {
        return `url('${this.image}')`
      }
    },
    watch: {
      playingMusic (newValue, oldValue) {
        utils.css('#app', 'backgroundImage', this.backgroundImage)
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        utils.css('#app', 'backgroundImage', vm.backgroundImage)
      })
    },
    beforeRouteLeave (to, from, next) {
      utils.css('#app', 'backgroundImage', this.defaultImage)
      next()
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