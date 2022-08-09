import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

// 设置超时时间
const TimeOut = 72000 // 秒

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 运行 npm dev 就会加入基地址 /api
  timeout: 5000
})

// 请求拦截器
// 请求拦截器主要处理：token 的统一注入问题
service.interceptors.request.use(config => {
  // config是所有的配置项，一定要记得返回
  if (store.getters.token) {
    // 有token的情况下需要对token的时间戳进行计算
    if (IsCheckTimeOut()) {
      // 超时了
      // 登出操作
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
// 响应拦截器主要处理：返回的数据异常和数据结构问题
service.interceptors.response.use(
  (response) => {
    // axios默认加了一层data,把 data 中的success 拿出来判断
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
      // return new Error('1111')
    }
  },
  error => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout') // 删除token信息
      router.push('/login') // 返回登录界面
    }
    Message.error(error.message) // 提示错误消息
    return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
)

// 定义一个方法用来计算token是否超时
function IsCheckTimeOut() {
  // 当前时间戳
  const currentTime = Date.now()
  // 写入的时间戳
  const timeStamp = getTimeStamp()

  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
