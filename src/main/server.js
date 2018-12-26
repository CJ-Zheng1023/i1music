const http = require('http')
const path = require('path')
const ms = require('mediaserver')
const fs = require('fs')
const mm = require('music-metadata')

ms.mediaTypes['.flac'] = 'audio/flac'
let allowKeys = []
Object.keys(ms.mediaTypes).forEach(ext => {
  if (ms.mediaTypes[ext].indexOf('audio') === 0) {
    allowKeys.push(ext)
  }
})
export default {
  startMusicServer (callback) {
    const _server = http.createServer(pipeMusic).listen(3333, () => {
      callback(_server.address().port, allowKeys)
    })
  },
  startImageServer (callback) {
    const _server = http.createServer(writeImage).listen(4444, () => {
      callback(_server.address().port)
    })
  }
}
// 推送音乐流
const pipeMusic = (req, res) => {
  // 客户端传参形式 http://localhost:port/xxx.mp3
  const musicUrl = decodeURIComponent(req.url.substring(1))
  const musicExt = path.extname(musicUrl)
  if (!allowKeys.includes(musicExt)) {
    return errorHandler(res, 'not allowed ext', 404)
  }
  if (!fs.existsSync(musicUrl)) {
    return errorHandler(res, 'not found music', 404)
  }
  ms.pipe(req, res, musicUrl)
}
const errorHandler = (res, msg, code) => {
  res.writeHead(code)
  res.end(msg)
}
// 根据音乐路径推送图片流
const writeImage = (req, res) => {
  const musicUrl = decodeURIComponent(req.url.substring(1))
  mm.parseFile(musicUrl, {native: true}).then(metadata => {
    const picture = metadata.common.picture
    if (picture) {
      res.writeHead(200, {
        'Content-Type': metadata.common.picture[0].format,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=' + (365 * 24 * 60 * 60 * 1000)
      })
      res.end(metadata.common.picture[0].data)
    } else {
      throw new Error('not have picture')
    }
  }).catch(e => {
    console.log(e)
    res.writeHead(301, {
      'location': 'http://afterwin.oss-cn-beijing.aliyuncs.com/i1music/default.png'
    })
    res.end()
  })
}
