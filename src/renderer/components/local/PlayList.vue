<template>
  <div class="play-list" ref="pageScroll">
    <div class="inner">
      <el-row :gutter="25">
        <el-col :md="6" :xl="4" v-for="item in playLists" :key="item.id">
          <router-link :to="'/local/playlistdetail/' + item.id">
            <div class="card">
              <div class="figure">
                <img :src="imageServer + encodeURIComponent(item.cover)" />
                <ul class="tags clearfix">
                  <li class="tag-item" v-for="tag in item.tags">
                    <a href="javascript:;"># {{tag}}</a>
                  </li>
                </ul>
                <div class="btn-wrapper">
                  <i class="iconfont icon-play"></i>
                </div>
              </div>
              <h3 class="name">
                <span>{{item.title}}</span>
                <div class="actions">
                  <i class="iconfont icon-delete" @click="deletePlayList(item.id, $event)"></i>
                </div>
              </h3>
            </div>
          </router-link>
        </el-col>
        <el-col :md="6" :xl="4">
          <div class="card card-create" @click="openDialog">
            <div class="figure"></div>
            <i class="iconfont icon-create1"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="创建歌单" :visible.sync="dialogVisible" :append-to-body ="true" width="500px">
      <div class="form-wrapper" ref="formScroll">
        <div class="form-inner">
          <el-form :model="playListForm" :rules="playListRules" label-width="80px" ref="createForm">
            <el-form-item prop="title" class="form-item" label="歌单名称">
              <el-input v-model="playListForm.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="tags" class="form-item" label="歌单标签">
              <el-input v-model="playListForm.tags" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" size="small" @click="chooseMusic">选择歌曲</el-button>
              <slot>
                <ul class="chosen">
                  <li class="chosen-item" v-for="item in chosenMusicArray">
                    <span>{{item}}</span>
                    <i class="iconfont icon-window-close" @click="drop(item)"></i>
                  </li>
                </ul>
              </slot>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="createPlayList" size="small" :loading="isLoading">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {remote} from 'electron'
  import {mapState, mapGetters, mapActions} from 'vuex'
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
        },
        chosenMusicSet: new Set(),
        isLoading: false
      }
    },
    computed: {
      ...mapState('Music', [
        'allowKeys',
        'playLists'
      ]),
      ...mapGetters('Music', [
        'imageServer'
      ]),
      chosenMusicArray () {
        return Array.from(this.chosenMusicSet)
      }
    },
    methods: {
      drop (item) {
        this.chosenMusicSet.delete(item)
        // set对象delete方法无法触发双向绑定，所以重新构造set对象的方式来处理
        this.chosenMusicSet = new Set([...this.chosenMusicSet])
      },
      openDialog () {
        this.dialogVisible = true
        this.chosenMusic = []
        this.$nextTick(() => {
          this.formScroll = new this.$BScroll(this.$refs.formScroll, {
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
      },
      chooseMusic () {
        remote.dialog.showOpenDialog({
          title: '选择音乐',
          filters: [
            {
              name: 'music',
              extensions: this.allowKeys
            }
          ],
          properties: ['openFile', 'multiSelections']
        }, filePaths => {
          if (filePaths) {
            this.chosenMusicSet = new Set([...this.chosenMusicSet, ...filePaths])
          }
        })
      },
      createPlayList () {
        this.$refs['createForm'].validate(valid => {
          if (valid) {
            this.isLoading = true
            this.addPlayList({
              title: this.playListForm.title,
              tags: this.playListForm.tags,
              musicPaths: this.chosenMusicArray
            }).then(() => {
              this.queryPlayLists()
              this.closeDialog()
              this.isLoading = false
            }).catch(e => {
              console.log(e)
              this.isLoading = false
            })
          }
        })
      },
      closeDialog () {
        this.dialogVisible = false
        this.$refs['createForm'].resetFields()
        this.chosenMusicSet = new Set()
      },
      deletePlayList (id, e) {
        this.removePlayList(id)
        this.queryPlayLists()
        e.preventDefault()
      },
      ...mapActions('Music', [
        'addPlayList',
        'queryPlayLists',
        'removePlayList'
      ])
    },
    mounted () {
      this.$nextTick(() => {
        this.pageScroll = new this.$BScroll(this.$refs.pageScroll, {
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
      this.queryPlayLists()
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
  .form-wrapper{
    padding: 0 20px;
    position: relative;
    height: 320px;
    box-sizing: border-box;
    overflow: hidden;
    .form-inner{
      padding: 30px 0;
    }
  }
  .chosen{
    padding: 0;
    margin: 0;
    .chosen-item{
      list-style: none;
      line-height: 20px;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      padding-right: 20px;
      position: relative;
      i{
        right: 0;
        top: 0;
        position: absolute;
        cursor: pointer;
        color: #F56C6C;
        font-size: 14px;
      }
    }
  }
</style>