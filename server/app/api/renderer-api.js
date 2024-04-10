const { app, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn, exec } = require('child_process')
const pkg = require('../../package.json')
const isDev = process.env.NODE_ENV === 'development'

class RendererAPI {
  constructor() {
    this.runningBrowserMap = {}
    this.userDataPath = path.resolve(process.env.LOCALAPPDATA, 'VirtualBrowser/User Data/')
    this.virtualDataFile = path.resolve(this.userDataPath, 'virtual.dat')
    this.globalDataFile = path.resolve(this.userDataPath, 'global.dat')
  }

  init() {
    this.bindChromeSend()
  }

  bindChromeSend() {
    ipcMain.on('getBrowserList', (e, args) => {
      let data
      try {
        data = fs.readFileSync(this.virtualDataFile, { encoding: 'utf-8' })
        data = JSON.parse(data)
      } catch {
        data = {}
      }
      e.sender.send('chromeSendResponse', [args[0], { data }])
    })
    ipcMain.on('setBrowserList', (e, args) => {
      fs.mkdirSync(this.userDataPath, { recursive: true })
      fs.writeFileSync(this.virtualDataFile, JSON.stringify(args[1]))
      e.sender.send('chromeSendResponse', [args[0], {}])
    })
    ipcMain.on('deleteBrowser', (e, args) => {
      const workerId = args[1]
      const userDataDir = path.resolve(
        process.env.LOCALAPPDATA,
        `VirtualBrowser/Workers/${workerId}`
      )
      fs.rmSync(userDataDir, { recursive: true })
      e.sender.send('chromeSendResponse', [args[0], {}])
    })

    ipcMain.on('getGlobalData', (e, args) => {
      let data
      try {
        data = fs.readFileSync(this.globalDataFile, { encoding: 'utf-8' })
        data = JSON.parse(data)
      } catch {
        data = {}
      }
      e.sender.send('chromeSendResponse', [args[0], { data }])
    })
    ipcMain.on('setGlobalData', (e, args) => {
      fs.mkdirSync(this.userDataPath, { recursive: true })
      fs.writeFileSync(this.globalDataFile, JSON.stringify(args[1]))
      e.sender.send('chromeSendResponse', [args[0], {}])
    })

    ipcMain.on('getRuningBrowser', (e, args) => {
      e.sender.send('chromeSendResponse', [args[0], Object.keys(this.runningBrowserMap)])
    })

    ipcMain.on('getBrowserVersion', (e, args) => {
      e.sender.send('chromeSendResponse', [args[0], pkg.version])
    })

    ipcMain.on('launchBrowser', (e, args) => {
      let rootDir = path.dirname(app.getPath('exe'))
      if (isDev) {
        rootDir = path.resolve(__dirname, '../../')
      }
      const chromePath = path.resolve(rootDir, 'VirtualBrowser/1.120.11.3/VirtualBrowser.exe')

      const workerId = args[1]
      const userDataDir = path.resolve(
        process.env.LOCALAPPDATA,
        `VirtualBrowser/Workers/${workerId}`
      )

      // copy virtual.dat/global.dat
      fs.mkdirSync(userDataDir, { recursive: true })
      fs.copyFileSync(this.virtualDataFile, path.resolve(userDataDir, 'virtual.dat'))
      if (fs.existsSync(this.globalDataFile)) {
        fs.copyFileSync(this.globalDataFile, path.resolve(userDataDir, 'global.dat'))
      }

      const cmdLine = [`--worker-id=${workerId}`, `--user-data-dir=${userDataDir}`]

      e.sender.executeJavaScript(`console.log('${chromePath}', '${cmdLine.join(' ')}')`)
      console.log(chromePath, cmdLine)

      // 启动 worker
      const cmd = exec(`"${chromePath}"` + ' ' + cmdLine.join(' '))
      cmd.on('spawn', (code, signal) => {
        this.runningBrowserMap[workerId] = true
        setTimeout(() => {
          e.sender.executeJavaScript('window.updateLaunchState()')
        }, 300)
      })
      cmd.on('close', (code, signal) => {
        delete this.runningBrowserMap[workerId]
        e.sender.executeJavaScript('window.updateLaunchState()')
      })

      e.sender.send('chromeSendResponse', [args[0], args[1]])
    })
  }
}

module.exports = RendererAPI
