import axios from 'axios'
import config from '@/common/scripts/config'
axios.defaults.timeout = 20000
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = config.dev_server_url
} else {
  axios.defaults.baseURL = config.pro_server_url
}
export default axios
