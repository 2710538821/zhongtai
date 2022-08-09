import request from '@/utils/request'

// 登录接口
export const login = data => {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => request({
  url: '/sys/profile',
  method: 'post'
})

// 通过id获取用户详情
export const getUserDetailById = id => request({
  url: `/sys/user/${id}`
})

