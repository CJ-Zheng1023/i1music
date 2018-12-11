const http = require('http')
const path = require('path')
const ms = require('mediaserver')
const fs = require('fs')

ms.mediaTypes['.flac'] = 'audio/flac'
let allowKeys = []
Object.keys(ms.mediaTypes).forEach(ext => {
  if (ms.mediaTypes[ext].indexOf('audio') === 0) {
    allowKeys.push(ext)
  }
})
export default {
  start (callback) {
    const _server = http.createServer(pipeMusic).listen(3333, () => {
      callback(_server.address().port, allowKeys)
    })
  }
}
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
