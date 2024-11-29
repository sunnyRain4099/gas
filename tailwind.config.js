/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 关闭预设样式
    container: false, // 关闭 container容器 模块（ .container 类冲突了）
    display: false // 关闭 display 模块（ .list-item 类冲突了）
  }
}
