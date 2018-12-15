import db from '@/common/scripts/db'
import utils from '@/common/scripts/utils'
const mm = require('music-metadata')
db.defaults({playLists: []}).write()
export default {
  namespaced: true,
  state () {
    return {
      playLists: [],
      // 允许的扩展名
      allowKeys: [],
      imageServerPort: 0,
      playListInfo: {},
      playListMusic: [],
      playListTag: [],
      playingMusic: {}
    }
  },
  getters: {
    imageServer (state) {
      return `http://localhost:${state.imageServerPort}/`
    }
  },
  mutations: {
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
      setPlaying(musicList, state.playingMusic.id)
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
      setPlaying(state.playListMusic, musicId)
    }
  },
  actions: {
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
    prepareToPlay ({commit}, music) {
      commit('setPlayingMusic', music)
      commit('setPlayingStatus', music.id)
    },
    // 在歌单详情删除音乐
    removeMusic ({commit}, {musicId, playListId}) {
      let musicListDB = db.get('playLists').find({id: playListId}).get('musicList')
      musicListDB.remove({id: musicId}).write()
      let result = musicListDB.value()
      let playListMusic = utils.formatData(result)
      commit('setPlayListMusic', playListMusic)
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
 */
const setPlaying = (musicList, musicId) => {
  musicList.forEach(music => {
    music['isPlaying'] = music.id === musicId && !music['isPlaying']
  })
}
