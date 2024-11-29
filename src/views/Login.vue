<!-- 登录页面 -->
<template>
  <div class="login-body">
    <!-- 左边图标 -->
    <div class="bg"></div>
    <!-- 右边登录页表 -->
    <div class="login-panel">
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <div class="login-title">燃气抢险</div>
        <!--账号输入-->
        <el-form-item prop="username">
          <el-input
            size="large"
            clearable
            placeholder="请输入账户"
            v-model.trim="formData.username"
            maxLength="150"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--登录密码-->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            type="password"
            size="large"
            placeholder="请输入密码"
            v-model.trim="formData.password"
            @keyup.enter="doSubmit"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册密码 -->
        <el-form-item prop="registerPassword" v-if="opType == 0">
          <el-input
            type="password"
            size="large"
            placeholder="请输入密码"
            v-model.trim="formData.registerPassword"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册确认密码 -->
        <el-form-item prop="reRegisterPassword" v-if="opType == 0">
          <el-input
            type="password"
            size="large"
            placeholder="请再次输入密码"
            v-model.trim="formData.reRegisterPassword"
            @keyup.enter="doSubmit"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录点击框 -->
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)"
              >没有账号？</a
            >
          </div>
        </el-form-item>
        <!-- 注册点击框 -->
        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
            >已有账号?</a
          >
        </el-form-item>
        <!-- 找回密码点击框 -->
        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
            >去登录?</a
          >
        </el-form-item>
        <!--登录按钮-->
        <el-form-item>
          <el-button
            type="primary"
            class="op-btn"
            @click="doSubmit"
            size="large"
          >
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 1">登录</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/user'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const formData = ref({})
const formDataRef = ref()
const userStore = useUserStore()
// 0:注册 1:登录 2:重置密码
const opType = ref(1)
const showPanel = (type) => {
  opType.value = type
  resetForm()
}

// 校验两次输入的密码是否一致
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

onMounted(() => {
  showPanel(1)
})
const rules = {
  username: [
    { required: true, message: '请输入账号' },
    {
      validator: proxy.Verify.username,
      message: '账号只能由3到20个字符字母和数字组成'
    }
  ],
  password: [{ required: true, message: '请输入密码' }],
  registerPassword: [
    { required: true, message: '请输入密码' },
    {
      validator: proxy.Verify.password,
      message: '密码只能是数字，字母，特殊字符 8-18位'
    }
  ],
  reRegisterPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator: checkRePassword,
      message: '两次输入的密码不一致'
    }
  ]
}

//重置表单
const resetForm = () => {
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = {}

    //登录
    if (opType.value == 1) {
      formData.value = userStore.loginInfo
    }
  })
}
//提交表单
const doSubmit = async () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return
    }
  })

  let params = {}
  Object.assign(params, formData.value)
  //注册或者修改密码
  if (opType.value == 0 || opType.value == 2) {
    params.password = params.registerPassword
    delete params.registerPassword
    delete params.reRegisterPassword
  }
  //登录
  if (opType.value == 0) {
    await userRegisterService(params)
  } else if (opType.value == 1) {
    const res = await userLoginService(params)
    userStore.setToken(res.data.data.token)
    userStore.setUser(formData.value)
    router.push('/')
  }
  // const result = await userLoginService(params)
  // //登录失败
  // if (!result) {
  //   return
  // }
  //注册返回
  if (opType.value == 0) {
    proxy.Message.success('注册成功,请登录')
    showPanel(1)
  } else if (opType.value == 1) {
    //登录
    if (params.rememberMe) {
      userStore.loginInfo = {
        username: params.username,
        password: params.password,
        rememberMe: params.rememberMe
      }
    } else {
      userStore.loginInfo = {
        username: '',
        password: '',
        rememberMe: false
      }
    }
    proxy.Message.success('登录成功')
    //存储cookie
    //重定向到原始页面
    // const redirectUrl = route.query.redirectUrl || '/'
    // router.push(redirectUrl)
  } else if (opType.value == 2) {
    //重置密码
    proxy.Message.success('重置密码成功,请登录')
    showPanel(1)
  }
}
</script>

<style lang="scss" scoped>
// 注册页面
// 注册页面
.login-body {
  height: calc(100vh); //视口高度100%
  background: url('../assets/login_shan.jpg');
  background-size: cover; //背景图片覆盖整个元素
  // background-position: center; // 背景图片居中显示
  // background-attachment: fixed; // 背景图片固定，不随滚动条滚动
  display: flex;
  .bg {
    flex: 1;
    background-size: 1;
    background-position: center;
    background-size: 800px;
    background-repeat: no-repeat; //背景图片不重复
    background-image: url(../assets/login_img.png);
  }
  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);
    .login-register {
      padding: 25px;
      background-color: #fff;
      border-radius: 5px;
      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-mail-btn {
          margin-left: 20px;
        }
      }
      .a-links {
        display: flex;
        margin-bottom: 10px;
        cursor: pointer;
        color: rgb(0, 115, 255);
      }
      .rememberme-panel {
        width: 100%;
      }
      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;
    .check-code {
      margin-left: 5px; //鼠标指针在悬停在元素上会变成一个手形图标
    }
  }

  .login-btn-qq {
    margin-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      cursor: pointer;
      margin-left: 10px;
      width: 20px;
    }
  }
}
</style>
