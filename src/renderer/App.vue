<template>
  <div id="app">
    <i-header></i-header>
    <router-view></router-view>
    <i-footer></i-footer>
    <side-bar></side-bar>
  </div>
</template>

<script>
  import Header from '@/components/header/Index'
  import Footer from '@/components/footer/Index'
  import SideBar from '@/components/sidebar/Index'
  export default {
    name: 'App',
    components: {
      IHeader: Header,
      IFooter: Footer,
      SideBar
    }
  }
</script>

<style lang="less">
  @import './common/styles/variable.less';
  html, body, #app{
    height: 100%;
  }
  body{
    overflow: hidden;
    //使用elementUI的dialog，会给body加17px的padding-right  TODO
    padding-right: 0 !important;
  }
  #app{
    background-color: @app-bg-color;
    background-image: url("./assets/images/bg2.jpg");
    background-size: cover;
    padding-top: @app-header-height;
    padding-bottom: @app-footer-height;
    box-sizing: border-box;
    box-shadow: 1px 4px 10px 2px #CCC;
    position: relative;
  }
  #app:after{
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    filter: blur(10px);
    z-index: 1;
  }

</style>
