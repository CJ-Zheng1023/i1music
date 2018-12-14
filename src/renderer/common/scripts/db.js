import config from '@/common/scripts/config'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.dbPath}/db.json`)
const _db = low(adapter)
export default {
  defaults (document) {
    _db.defaults(document).write()
  },
  push (table, data, where, to) {
    if (where && !to) {
      _db.get(table).find(where).push(data).write()
    } else if (where && to) {
      _db.get(table).find(where).get(to).push(data).write()
    } else {
      _db.get(table).push(data).write()
    }
  },
  pushAll (table, data, where, to) {
    let result = _db.get(table).find(where).get(to).push(...data).write()
    return formatData(result)
  },
  find (table, where) {
    let result
    result = where ? _db.get(table).find(where).value() : _db.get(table).value()
    return formatData(result)
  },
  remove (table, where) {
    _db.get(table).remove(where).write()
  }
}
// 去除lowdb查出来的数据里附带的observer
const formatData = (data) => JSON.parse(JSON.stringify(data))
