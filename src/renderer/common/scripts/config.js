import {remote} from 'electron'
export default {
  default_img_url: 'http://afterwin.oss-cn-beijing.aliyuncs.com/i1music/default.png',
  dbPath: `${remote.app.getPath('userData')}`
}
