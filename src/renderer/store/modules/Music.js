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
      playListTag: []
    }
  },
  getters: {
    imageServer (state) {
      return `http://localhost:${state.imageServerPort}`
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
      state.playListMusic = musicList
    },
    setPlayListTag (state, tags) {
      state.playListTag = tags
    }
  },
  actions: {
    setAllowKeys ({commit}, data) {
      commit('setAllowKeys', data)
    },
    setImageServerPort ({commit}, port) {
      commit('setImageServerPort', port)
    },
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
    removePlayList ({commit}, id) {
      db.get('playLists').remove({id}).write()
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
