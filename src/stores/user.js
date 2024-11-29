// import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const loginInfo = ref({
      username: 'fanwanghao',
      password: '',
      rememberMe: false
    })
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = () => {}

    const setUser = (res) => {
      loginInfo.value = res
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
      loginInfo
    }
  },
  {
    persist: true
  }
)
