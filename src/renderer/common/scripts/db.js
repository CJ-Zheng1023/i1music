import config from '@/common/scripts/config'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.dbPath}/db.json`)
const _db = low(adapter)
export default {
  defaults (document) {
    _db.defaults(document).write()
  },
  push (table, data) {
    _db.get(table).push(data).write()
  },
  find (table, data) {
    return data ? _db.get(table).find(data).value() : _db.get(table).value()
  }
}
