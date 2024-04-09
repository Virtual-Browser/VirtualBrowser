const { app, Menu, shell, dialog } = require('electron')
// const { openProcessManager } = require('electron-process-manager')

let mainWindow
// const appName = app.name
const template = [{
  id: 2,
  label: '文件',
  submenu: [
    { label: '撤销', enabled: false, role: 'undo' },
    { label: '重做', role: 'redo' },
    { type: 'separator' },
    { label: '剪切', role: 'cut' },
    { label: '复制', role: 'copy' },
    { label: '粘贴', role: 'paste' },
    { label: '粘贴并匹配样式', role: 'pasteandmatchstyle' },
    { label: '删除', role: 'delete' },
    { label: '全选', role: 'selectall' },
    { type: 'separator' },
    { label: '退出', role: 'quit' }
  ]
},
{
  label: '操作',
  id: 3,
  // enabled: false,
  submenu: [
    // { label: '重新加载', role: 'reload' },
    { label: '放大', role: 'zoomin' },
    { label: '缩小', role: 'zoomout' },
    { label: '重置', role: 'resetzoom' },
    { type: 'separator' },
    { label: '进入全屏', role: 'togglefullscreen' }
  ]
},
{
  role: 'window',
  label: '工具',
  id: 4,
  submenu: [{
    label: '刷新',
    accelerator: 'Ctrl+R',
    click () {
      mainWindow.webContents.send('main:renderer', 'refresh')
    }
  },
  { label: '最小化', role: 'minimize' }
  ]
},
{
  role: 'help',
  label: '帮助',
  id: 5,
  submenu: [
    { label: '切换开发者工具', role: 'toggleDevTools', accelerator: 'Ctrl+Shift+I', visible: true },
    // {
    //   label: '任务管理器',
    //   click () {
    //     openProcessManager()
    //   }
    // },
    { type: 'separator' },
    {
      label: '关于',
      click (menu, mainWin) {
        const options = {
          type: 'info',
          title: '关于',
          message: 'electron vue elementui'
          // buttons: ['是', '否']
        }

        dialog.showMessageBox(mainWin, options, function (index) {
          // event.sender.send('information-dialog-selection', index)
        })
      }
    }
  ]
}
]

const menu = Menu.buildFromTemplate(template)
let menusMap = {} // 菜单ID对应 MenuItem
app.on('ready', (e) => {
  Menu.setApplicationMenu(menu)
  let menus = Menu.getApplicationMenu()
  let items = menus.items
  items.forEach(item => {
    menusMap[item.id] = item
  })
})

function enabledMenu (ids, isEnabled) {
  ids.forEach(id => {
    menusMap[id].visible = isEnabled
    // console.log(menusMap[id])
  })
}

module.exports = {
  setMainWindow (win) {
    mainWindow = win
  },
  showDefault () {
    enabledMenu([2, 3, 4], false)
  },
  showEditor () {
    enabledMenu([2, 3, 4], true)
  }
}
