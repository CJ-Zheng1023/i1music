<template>
  <footer>
    <div class="inner">
      <div class="btns">btns</div>
      <div class="progress">progress</div>
      <div class="controls">controls</div>
    </div>
  </footer>
</template>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  footer{
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
      width: @inner-lr-padding;
      position: absolute;
    }
    .controls{
      right: 0;
      top: 0;
      width: @inner-lr-padding;
      position: absolute;
    }
  }
</style>