import db from '@/common/scripts/db'
import utils from '@/common/scripts/utils'
const mm = require('music-metadata')
db.defaults({playLists: []}).write()
export default {
  namespaced: true,
  state () {
    return {
      // 应用背景图
      defaultImage: utils.css('#app', 'backgroundImage'),
      playLists: [],
      // 允许的扩展名
      allowKeys: [],
      imageServerPort: 0,
      playListInfo: {},
      playListMusic: [],
      playListTag: [],
      playingMusic: {},
      // 指令标志位，分为flag,reload,stop和play+musicId（用来控制footer播放面板暂停和播放按钮。在footer组建里监听该值，执行播放或暂停）
      flag: 'pause',
      // 播放模式   single单曲循环 shuffle随机播放 cycle循环播放
      playMode: 'cycle',
      // sidebar 是否展开
      isOpen: false
    }
  },
  getters: {
    imageServer (state) {
      return `http://localhost:${state.imageServerPort}/`
    },
    // 打乱播放顺序，用于随机播放功能
    shuffled (state) {
      let array = []
      let result = []
      state.playListMusic.forEach(music => {
        array.push(music.id)
      })
      while (array.length > 0) {
        let index = parseInt(Math.random() * (array.length))
        result.push(array[index])
        array.splice(index, 1)
      }
      return result
    }
  },
  mutations: {
    setIsOpen (state, flag) {
      state.isOpen = flag
    },
    setAllowKeys (state, data) {
      state.allowKeys = data
    },
    setImageServerPort (state, port) {
      state.imageServerPort = port
    },
    queryPlayLists (state, playLists) {
      state.playLists = playLists
    },
    setPlayListInfo (state, info) {
      state.playListInfo = info
    },
    setPlayListMusic (state, musicList) {
      setPlaying(musicList, state.playingMusic.id, state.playingMusic.isPlaying)
      state.playListMusic = musicList
    },
    setPlayListTag (state, tags) {
      state.playListTag = tags
    },
    // 设置当前播放的歌曲
    setPlayingMusic (state, music) {
      state.playingMusic = music
    },
    // 设置歌曲列表的播放状态
    setPlayingStatus (state, musicId) {
      setPlaying(state.playListMusic, musicId, state.playingMusic.isPlaying)
    },
    setPlayingMusicStatus (state) {
      state.playingMusic.isPlaying = !state.playingMusic.isPlaying
    },
    setFlag (state, flag) {
      state.flag = flag
    },
    setPlayMode (state) {
      let currentMode = state.playMode
      if (currentMode === 'cycle') {
        state.playMode = 'shuffle'
      } else if (currentMode === 'shuffle') {
        state.playMode = 'single'
      } else if (currentMode === 'single') {
        state.playMode = 'cycle'
      }
    }
  },
  actions: {
    // 控制sidebar展开/收缩
    setIsOpen ({commit}, flag) {
      commit('setIsOpen', flag)
    },
    setAllowKeys ({commit}, data) {
      commit('setAllowKeys', data)
    },
    setImageServerPort ({commit}, port) {
      commit('setImageServerPort', port)
    },
    // 新建歌单
    addPlayList ({commit}, playList) {
      const musicPaths = playList['musicPaths']
      return parseMusicFile(musicPaths).then(({musicList, cover}) => {
        db.get('playLists').push({
          id: utils.idGenerator(),
          title: playList.title,
          tags: playList.tags.trim().replace(/, +/g, ',').replace(/， +/g, '，').replace(/ +/, ' ').split(/,|，| /),
          cover,
          musicList
        }).write()
      })
    },
    // 查询歌单列表
    queryPlayLists ({commit}) {
      let result = db.get('playLists').value()
      const playLists = utils.formatData(result)
      commit('queryPlayLists', playLists)
    },
    // 查询歌单详情
    queryPlayListDetail ({commit}, id) {
      let result = db.get('playLists').find({id: id}).value()
      const playListDetail = utils.formatData(result)
      commit('setPlayListInfo', {id: playListDetail.id, title: playListDetail.title, cover: playListDetail.cover})
      commit('setPlayListMusic', playListDetail.musicList)
      commit('setPlayListTag', playListDetail.tags)
    },
    // 在歌单详情里添加歌曲
    addMusic ({commit}, {musicPaths, id}) {
      return parseMusicFile(musicPaths).then(data => {
        let musicList = data['musicList']
        let result = db.get('playLists').find({id: id}).get('musicList').push(...musicList).write()
        let playListMusic = utils.formatData(result)
        commit('setPlayListMusic', playListMusic)
      })
    },
    // 删除歌单
    removePlayList ({commit}, id) {
      db.get('playLists').remove({id}).write()
    },
    // 配置各种状态值
    prepareToPlay ({commit, state}, music) {
      let flag = ''
      // 缓存待播放音乐信息
      commit('setPlayingMusic', music)
      if (music.isPlaying) {
        // 暂停指令
        flag = 'pause'
      } else {
        // 播放指令
        flag = `play${music.id}`
      }
      // 设置播放或暂停指令，用于控制footer组件播放和暂停按钮
      commit('setFlag', flag)
    },
    // 停止播放
    stopPlay ({commit}) {
      commit('setPlayingMusic', {})
      commit('setFlag', 'stop')
    },
    // 重新播放
    reload ({commit}) {
      // 给随机数为了在footer里触发
      commit('setFlag', `reload${new Date().getMilliseconds()}`)
    },
    // 设置播放列表播放/暂停状态
    setPlayingStatus ({commit}, musicId) {
      commit('setPlayingStatus', musicId)
    },
    // 修改待播放音乐信息状态
    setPlayingMusicStatus ({commit}) {
      commit('setPlayingMusicStatus')
    },
    // 在歌单详情删除音乐
    removeMusic ({commit}, {musicId, playListId}) {
      let musicListDB = db.get('playLists').find({id: playListId}).get('musicList')
      musicListDB.remove({id: musicId}).write()
      let result = musicListDB.value()
      let playListMusic = utils.formatData(result)
      commit('setPlayListMusic', playListMusic)
    },
    setPlayMode ({commit}) {
      commit('setPlayMode')
    }
  }
}
// 解析音频文件，获取歌曲信息
const parseMusicFile = paths => {
  let promises = []
  let musicList = []
  paths.forEach((musicPath, index) => {
    promises.push(mm.parseFile(musicPath, {native: true}))
    musicList[index] = {path: musicPath}
  })
  let hasFlag = false
  let cover = ''
  return Promise.all(promises).then(metadatas => {
    metadatas.forEach((item, index) => {
      let common = item.common
      let format = item.format
      if (!hasFlag && common.picture) {
        cover = musicList[index].path
        hasFlag = true
      }
      let data = {
        id: utils.idGenerator(),
        title: common.title,
        artist: common.artist,
        album: common.album,
        duration: utils.formatDuration(format.duration)
      }
      Object.assign(musicList[index], data)
    })
    return {musicList, cover}
  })
}
/**
 * 设置音乐播放状态
 * @param musicList    音乐列表
 * @param musicId      需要设置状态的音乐ID   （播放/暂停状态）
 * @param isPlaying    播放器的播放状态
 */
const setPlaying = (musicList, musicId, isPlaying) => {
  musicList.forEach(music => {
    music['isPlaying'] = music.id === musicId && isPlaying && !music['isPlaying']
  })
}
