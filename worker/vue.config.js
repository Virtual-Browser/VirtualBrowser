const { defineConfig } = require('@vue/cli-service')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '.',
  outputDir: 'dist/worker',
  filenameHashing: false,
  productionSourceMap: false,

  configureWebpack: {
    plugins: [
      require('unplugin-auto-import/webpack')({
        resolvers: [ElementPlusResolver()]
      }),
      require('unplugin-vue-components/webpack')({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
