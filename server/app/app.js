// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const ipcMain = require('electron').ipcMain
// const Menu = require('./lib/menu')
const { FileAccess } = require('./base/common/network')
const pkg = require('../package.json')
const path = require('path')
const RendererAPI = require('./api/renderer-api')
const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const winUrl = isDev
  ? 'http://localhost:9527/index.html?main'
  : 'file://' + path.join(__dirname, '../dist/server/index.html?main')

function createWindow() {
  const webPreferences = {
    contextIsolation: false,
    preload: FileAccess.asFileUri('/app/sandbox/preload.js'),
    // webSecurity: false,
    nodeIntegration: true // 集成NodeJS

    // webviewTag: true // 支持WebView标签
  }
  const options = {
    show: true,
    width: 1200,
    height: 768,
    x: 208,
    y: 59,
    // backgroundColor: '#1e1e1e',
    minWidth: 400,
    minHeight: 270,
    title: 'Virtual Browser | ' + pkg.version,
    // icon: 'c:\\work\\github\\vscode\\resources\\win32\\code_150x150.png',
    // titleBarStyle: 'hidden',
    // frame: false,
    vibrancy: 'dark',
    webPreferences
  }
  console.log(options)

  // Create the browser window.
  mainWindow = new BrowserWindow(options)

  Menu.setApplicationMenu(null)

  // and load the index.html of the app.
  mainWindow.loadURL(winUrl)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('maximize', e => {
    console.log('maximize')
    mainWindow.webContents.send('ipc:win-on-maximize')
  })
  mainWindow.on('unmaximize', e => {
    console.log('unmaximize')
    mainWindow.webContents.send('ipc:win-on-unmaximize')
  })

  mainWindow.on('page-title-updated', e => {
    e.preventDefault()
  })

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  // Menu.setMainWindow(mainWindow)
  // Menu.showDefault()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Menu.showEditor()
  })
}

// app.commandLine.appendSwitch('remote-debugging-port', 14600)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var openFilePath
app.on('open-file', (event, path) => {
  openFilePath = path

  if (mainWindow === null) {
    createWindow()
  } else if (mainWindow) {
    mainWindow.webContents.send('get-openfilepath-reply', openFilePath)
  }
  // app.focus()
  console.log('open-file', event, path)
})

ipcMain.on('get-openfilepath', event => {
  event.sender.send('get-openfilepath-reply', openFilePath)
})
ipcMain.on('ipc:win-minimize', () => {
  mainWindow.minimize()
})
ipcMain.on('ipc:win-maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on('ipc:win-close', () => {
  console.log('ipc:win-close')
  // mainWindow.close()
  // app.quit()
  app.exit()
})

new RendererAPI().init()
