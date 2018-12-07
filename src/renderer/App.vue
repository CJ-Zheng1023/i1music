<template>
  <div id="app">
    <i-header></i-header>
    <router-view></router-view>
    <i-footer></i-footer>
  </div>
</template>

<script>
  import Header from '@/components/header/Index'
  import Footer from '@/components/footer/Index'
  export default {
    name: 'App',
    components: {
      IHeader: Header,
      IFooter: Footer
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
  }
  #app{
    background-color: @app-bg-color;
    padding-top: @app-header-height;
    padding-bottom: @app-footer-height;
    box-sizing: border-box;
    box-shadow: 1px 4px 10px 2px #CCC;
    position: relative;
  }

</style>
