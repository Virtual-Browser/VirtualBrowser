const ipcMain = require('electron').ipcMain
const path = require('path')
const fs = require('fs')

class RendererAPI {
  init() {
    this.bindChromeSend()
  }

  bindChromeSend() {
    ipcMain.on('getBrowserList', (e, args) => {
      // fs.readFileSync()
      const dataPath = path.resolve(
        process.env.LOCALAPPDATA,
        'VirtualBrowser/User Data/virtual.dat'
      )
      let data = fs.readFileSync(dataPath, { encoding: 'utf-8' })
      data = JSON.parse(data)
      e.sender.send('chromeSendResponse', [args[0], { data }])
    })
  }
}

module.exports = RendererAPI
