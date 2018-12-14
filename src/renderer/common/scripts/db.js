import config from '@/common/scripts/config'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.dbPath}/db.json`)
const db = low(adapter)
export default db
