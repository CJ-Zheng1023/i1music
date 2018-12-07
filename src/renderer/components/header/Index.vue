<template>
  <header>
    <div class="brand">
      <div class="logo">brand</div>
    </div>
    <div class="menu-bar">menu bar</div>
    <div class="actions">actions</div>
  </header>
</template>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  header{
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
    }
    .menu-bar{
      display: inline-block;
    }
    .actions{
      float: right;
    }
  }
</style>