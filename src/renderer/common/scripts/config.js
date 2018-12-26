import {remote} from 'electron'
export default {
  dbPath: `${remote.app.getPath('userData')}`
}
