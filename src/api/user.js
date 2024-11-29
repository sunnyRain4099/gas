import request from '@/utils/Request'

//注册接口
export const userRegisterService = ({ username, password }) => {
  return request.post('/manner/enroll', { username, password })
}

//登录接口
export const userLoginService = ({ username, password }) => {
  return request.post('/manner/login', { username, password })
}
