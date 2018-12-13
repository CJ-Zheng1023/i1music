import config from '@/common/scripts/config'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.dbPath}/db.json`)
console.log(config.dbPath)
const db = low(adapter)
const mm = require('music-metadata')
const fs = require('fs')
// const util = require('util')
db.defaults({playLists: []}).write()
export default {
  namespaced: true,
  state () {
    return {
      playLists: [],
      // 允许的扩展名
      allowKeys: []
    }
  },
  mutations: {
    setAllowKeys (state, data) {
      state.allowKeys = data
    }
  },
  actions: {
    setAllowKeys ({commit}, data) {
      commit('setAllowKeys', data)
    },
    addPlayList ({commit}, playList) {
      const musicList = playList['musicList']
      let promises = []
      musicList.forEach(music => {
        promises.push(mm.parseFile(music, {native: true}))
      })
      Promise.all(promises).then(metadatas => {
        metadatas.forEach((item, index) => {
          let common = item.common
          let format = item.format
          let data = {
            music: musicList[index],
            title: common.title,
            artist: common.artist,
            album: common.album,
            duration: format.duration
          }
          let picture = common.picture
          if (picture) {
            data['picture'] = picture[0].data.toString('Binary')
          }
          db.get('playLists').push(data).write()
        })
        let data1 = db.get('playLists').find({title: '안아줘'}).value()
        console.log(data1)
        console.log(data1.picture)
        let buffer = new Buffer(data1.picture, 'Binary')
        fs.writeFileSync(`${config.dbPath}/1.jpeg`, buffer)
      })
    }
  }
}
