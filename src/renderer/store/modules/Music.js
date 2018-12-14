import db from '@/common/scripts/db'
import utils from '@/common/scripts/utils'
const mm = require('music-metadata')
db.defaults({playLists: []})
export default {
  namespaced: true,
  state () {
    return {
      playLists: [],
      // 允许的扩展名
      allowKeys: [],
      imageServerPort: 0
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
      return new Promise((resolve, reject) => {
        const musicPaths = playList['musicPaths']
        let promises = []
        let musicList = []
        musicPaths.forEach((musicPath, index) => {
          promises.push(mm.parseFile(musicPath, {native: true}))
          musicList[index] = {path: musicPath}
        })
        let hasFlag = false
        let cover = ''
        Promise.all(promises).then(metadatas => {
          metadatas.forEach((item, index) => {
            let common = item.common
            let format = item.format
            if (!hasFlag && common.picture) {
              cover = musicList[index].path
              hasFlag = true
            }
            let data = {
              title: common.title,
              artist: common.artist,
              album: common.album,
              duration: format.duration
            }
            Object.assign(musicList[index], data)
          })
          db.push('playLists', {
            id: utils.idGenerator(),
            title: playList.title,
            tags: playList.tags.trim().replace(/, +/g, ',').replace(/， +/g, '，').replace(/ +/, ' ').split(/,|，| /),
            cover,
            musicList
          })
          resolve()
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    queryPlayLists ({commit}) {
      const playLists = db.find('playLists')
      commit('queryPlayLists', playLists)
    }
  }
}
