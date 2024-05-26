import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

//自动导入ui-组件 比如说ant-design-vue  element-plus等

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './'
})
