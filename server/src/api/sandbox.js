if (!window.sandboxAPI) {
  window.sandboxAPI = {
    ipcRenderer: {
      on(...args) {
        console.log('sandboxAPI.ipcRenderer.on()', args)
      },
      send(...args) {
        console.log('sandboxAPI.ipcRenderer.send()', args)
      }
    }
  }
}

if (!chrome.send) {
  chrome.send = window.sandboxAPI.ipcRenderer.send
  window.sandboxAPI.ipcRenderer.on('chromeSendResponse', (e, args) => {
    window.cr.webUIResponse(args[0], 'ok', args[1])
  })
}
