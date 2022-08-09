// 提供了对 token 缓存的方法 get set remove
import Cookies from 'js-cookie'

const TokenKey = 'itheima^-^'
const timeKey = 'itheimaTokenTimeOut'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
