let crypto = require('crypto')

const USER_NAME_KEY = 'username'
const TOKEN_KEY = 'token'
const getItem = (key) => window.localStorage.getItem(key)
const setItem = (key, value) => window.localStorage.setItem(key, value)
const removeItem = (key) => window.localStorage.removeItem(key)
export default {
  idGenerator () {
    let buf = crypto.randomBytes(16)
    return buf.toString('hex')
  },
  isLogin () {
    return !!this.getUserName()
  },
  getUserName () {
    return getItem(USER_NAME_KEY)
  },
  getToken () {
    return getItem(TOKEN_KEY)
  },
  setUserName (value) {
    setItem(USER_NAME_KEY, value)
  },
  setToken (value) {
    setItem(TOKEN_KEY, value)
  },
  clearStorage () {
    removeItem(USER_NAME_KEY)
    removeItem(TOKEN_KEY)
  }
}
