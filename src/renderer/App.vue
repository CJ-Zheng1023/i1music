<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body, #app{
    height: 100%;
  }
  body{
    overflow: hidden;
  }
  #app{
    background-image: linear-gradient(135deg, rgb(129, 251, 184) 10%, rgb(40, 199, 111) 100%);
  }

</style>
