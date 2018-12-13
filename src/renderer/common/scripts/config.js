import {remote} from 'electron'
export default {
  pro_server_url: 'http://rap2api.taobao.org/app/mock/116837',
  dev_server_url: 'http://rap2api.taobao.org/app/mock/116837',
  dbPath: `${remote.app.getPath('userData')}`
}
