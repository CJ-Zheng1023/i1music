<template>
  <div class="play-list" ref="scroll">
    <div class="inner">
      <el-row :gutter="25">
        <el-col :md="6" :xl="4">
          <router-link to="/local/playlistdetail">
            <div class="card">
              <div class="figure">
                <img src="../../assets/images/1.jpeg" />
                <ul class="tags clearfix">
                  <li class="tag-item">
                    <a href="javascript:;">#hip hop</a>
                  </li>
                  <li class="tag-item">
                    <a href="javascript:;">#R&B</a>
                  </li>
                </ul>
                <div class="btn-wrapper">
                  <i class="iconfont icon-play"></i>
                </div>
              </div>
              <h3 class="name">
                <span>Eminem全专辑</span>
                <div class="actions">
                  <i class="iconfont icon-delete"></i>
                </div>
              </h3>
            </div>
          </router-link>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/2.jpeg" />
              <ul class="tags clearfix">
                <li class="tag-item">
                  <a href="javascript:;">#rock</a>
                </li>
              </ul>
              <div class="btn-wrapper">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <h3 class="name">
              <span>FTIland全集</span>
              <div class="actions">
                <i class="iconfont icon-delete"></i>
              </div>
            </h3>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/3.jpeg" />
              <ul class="tags clearfix">
                <li class="tag-item">
                  <a href="javascript:;">#ballad</a>
                </li>
                <li class="tag-item">
                  <a href="javascript:;">#R&B</a>
                </li>
              </ul>
              <div class="btn-wrapper">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <h3 class="name">
              <span>eddy kim</span>
              <div class="actions">
                <i class="iconfont icon-delete"></i>
              </div>
            </h3>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/4.jpeg" />
              <ul class="tags clearfix">
                <li class="tag-item">
                  <a href="javascript:;">#hip hop</a>
                </li>
              </ul>
              <div class="btn-wrapper">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <h3 class="name">
              <span>dok2</span>
              <div class="actions">
                <i class="iconfont icon-delete"></i>
              </div>
            </h3>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card">
            <div class="figure">
              <img src="../../assets/images/2.jpeg" />
              <ul class="tags clearfix">
                <li class="tag-item">
                  <a href="javascript:;">#hip hop</a>
                </li>
                <li class="tag-item">
                  <a href="javascript:;">#R&B</a>
                </li>
              </ul>
              <div class="btn-wrapper">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <h3 class="name">
              <span>nafla&loopy</span>
              <div class="actions">
                <i class="iconfont icon-delete"></i>
              </div>
            </h3>
          </div>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card card-create" @click="dialogVisible = true">
            <div class="figure"></div>
            <i class="iconfont icon-create1"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="创建歌单" :visible.sync="dialogVisible" :append-to-body ="true" width="30%">
      <el-form :model="playListForm" :rules="playListRules" ref="createForm" label-width="80px">
        <el-form-item prop="title" class="form-item" label="歌单名称">
          <el-input v-model="playListForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="tags" class="form-item" label="歌单标签">
          <el-input v-model="playListForm.tags" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="small" @click="chooseMusic">选择歌曲</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="createPlayList" size="small">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dialogVisible: false,
        playListForm: {
          title: '',
          tags: ''
        },
        playListRules: {
          title: [
            {required: true, message: '请输入歌单名称', trigger: 'blur'}
          ],
          tags: [
            {required: true, message: '请输入歌单标签', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      chooseMusic () {
        console.log(123)
      },
      createPlayList () {
        this.$refs['createForm'].validate(valid => {
          if (valid) {
            this.closeDialog()
          }
        })
      },
      closeDialog () {
        this.dialogVisible = false
        this.$refs['createForm'].resetFields()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.scroll = new this.$BScroll(this.$refs.scroll, {
          probeType: 1,
          click: true,
          mouseWheel: {
            speed: 20,
            invert: false
          },
          scrollbar: {
            fade: false,
            interactive: true
          }
        })
      })
    }
  }
</script>
<style scoped lang="less">
  @import '../../common/styles/variable.less';
  .play-list{
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 @app-lr-padding;
    .inner{
      padding: 20px 0;
    }
  }
  .el-col{
    text-align: center;
  }
</style>