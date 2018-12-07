<template>
  <header>
    <div class="brand">
      <div class="logo">
        <i class="iconfont icon-logo3"></i>
      </div>
      <strong class="title">I1Music</strong>
    </div>
    <div class="menu-bar">
      <ul class="menus">
        <li class="menu-item">
          <router-link to="/local" tag="a">本地音乐</router-link>
        </li>
        <li class="menu-item">
          <router-link to="/online" tag="a">在线音乐</router-link>
        </li>
        <li class="menu-item">
          <router-link to="/setting" tag="a">设置</router-link>
        </li>
      </ul>
    </div>
    <div class="actions">
      <i class="iconfont icon-window-min" @click="minWindow"></i>
      <i :class="['iconfont', isMaxWindow ? 'icon-window-restore' : 'icon-window-max']" @click="maxWindow"></i>
      <i class="iconfont icon-window-close" @click="closeWindow"></i>
    </div>
  </header>
</template>
<script>
  import {ipcRenderer} from 'electron'
  export default {
    data () {
      return {
        isMaxWindow: false
      }
    },
    methods: {
      minWindow () {
        ipcRenderer.send('min-window')
      },
      closeWindow () {
        ipcRenderer.send('close-window')
      },
      maxWindow () {
        ipcRenderer.send('max-window')
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        ipcRenderer.send('resize-window')
      })
      ipcRenderer.on('is-max-window', (e, flag) => {
        this.isMaxWindow = flag
      })
    }
  }
</script>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  header{
    -webkit-app-region: drag;
    box-sizing: border-box;
    line-height: @app-header-height;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    padding: 0 @app-lr-padding;
    .brand{
      float: left;
      .logo{
        width: 30px;
        display: inline-block;
        background-color: #ffcc00;
        border-radius: 3px;
        text-align: center;
        line-height: 30px;
        margin-right: 6px;
        i{
          font-size: 16px;
        }
      }
      .title{
        color: #c0a707;
        font-size: 19px;
      }
    }
    .menu-bar{
      -webkit-app-region: no-drag;
      display: inline-block;
      .menus{
        margin: 0;
        padding: 0;
        overflow: hidden;
        .menu-item{
          float: left;
          list-style: none;
          margin: 0 10px;
          a{
            font-size: 14px;
            text-decoration: none;
            color: #c0a707;
          }
          a.active{
            color: #fff;
          }
        }
      }
    }
    .actions{
      -webkit-app-region: no-drag;
      float: right;
      i{
        margin: 0 3px;
        cursor: pointer;
        color: #a0a0a0;
      }
    }
  }
</style>